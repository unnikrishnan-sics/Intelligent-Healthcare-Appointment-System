const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { calculateNoShowRisk } = require('../utils/predictionService');
const { sendBookingReceipt } = require('../utils/emailService');

// Initialize Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Book an appointment (Initialize Payment)
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
    const { doctorId, date, timeSlot, reason } = req.body;

    // console.log("--- Booking Request (Token System - Stripe) ---");

    try {
        const doctorProfile = await Doctor.findOne({ userId: doctorId });
        if (!doctorProfile) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        // 1. Availability Check (Session Validation)
        const inputDate = new Date(date);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[inputDate.getUTCDay()];

        const daySchedule = doctorProfile.availability.find(d => d.day === dayName);
        if (!daySchedule) {
            return res.status(400).json({ message: `Doctor is not available on ${dayName}` });
        }

        // Verify if selected timeSlot is within the doctor's working window
        const [slotH, slotM] = timeSlot.split(':').map(Number);
        const [startH, startM] = daySchedule.startTime.split(':').map(Number);
        const [endH, endM] = daySchedule.endTime.split(':').map(Number);

        if ((slotH * 60 + slotM) < (startH * 60 + startM) || (slotH * 60 + slotM) >= (endH * 60 + endM)) {
            return res.status(400).json({ message: `Selected session is outside working hours` });
        }

        // --- INTELLIGENT PRIORITY ASSIGNMENT ---
        // Check patient history: Look at the MOST RECENT appointment
        // If the last visit was Critical, we assume they are still Critical (Continuity of Care)
        // If the doctor marked them Normal last time, they revert to Normal key.
        let calculatedPriority = 'Normal';

        const lastAppointment = await Appointment.findOne({
            patientId: req.user.id,
            doctorId: doctorId, // Scope to THIS doctor only
            status: 'Completed' // Only look at finished sessions to judge "outcome"
        }).sort({ date: -1 });

        if (lastAppointment && lastAppointment.priority === 'Critical') {
            calculatedPriority = 'Critical';
        }

        // 2. TOKEN ASSIGNMENT
        const existingAppointments = await Appointment.find({
            doctorId,
            date,
            status: { $nin: ['Cancelled', 'Rejected'] }
        }).sort({ tokenNumber: -1 }).limit(1);

        const nextToken = (existingAppointments.length > 0 && existingAppointments[0].tokenNumber)
            ? existingAppointments[0].tokenNumber + 1
            : 1;

        // Calculate Risk Score
        const prediction = await calculateNoShowRisk(req.user.id, date, timeSlot);

        // 3. CREATE STRIPE PAYMENT INTENT
        const amount = (doctorProfile.feesPerConsultation || 500) * 100; // cents
        const currency = 'inr';

        // Stripe India Export Requirement: Customer Name and Address
        const customerAddress = req.user.address || "India"; // Fallback if empty, but we encourage it
        const customerName = req.user.name;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            description: 'Medical Consultation Fees',
            shipping: {
                name: customerName,
                address: {
                    line1: customerAddress,
                    country: 'IN' // Defaulting to India for now
                }
            },
            automatic_payment_methods: {
                enabled: true,
            },
            // payment_method_types: ['card', 'upi'], // Reverting to Dashboard Control checks
            metadata: {
                doctorId,
                patientId: req.user.id,
                date,
                tokenNumber: nextToken
            }
        });

        const { sendBookingReceipt } = require('../utils/emailService');

        // ... (in bookAppointment)

        const appointment = await Appointment.create({
            patientId: req.user.id,
            doctorId,
            date,
            timeSlot,
            tokenNumber: nextToken,
            priority: calculatedPriority, // Auto-assigned or Default Normal
            reason,
            status: 'Pending',
            paymentStatus: 'Pending',
            razorpayOrderId: paymentIntent.id, // Storing PI ID here for reference
            predictionScore: prediction.score,
            riskFactors: prediction.factors
        });

        // Send Email Receipt (Async - don't block response)
        sendBookingReceipt(req.user, appointment).catch(err => console.error("Email Error:", err));

        res.status(201).json({
            appointment,
            clientSecret: paymentIntent.client_secret, // Send to Frontend
            tokenNumber: nextToken
        });

    } catch (error) {
        console.error("Booking Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify Payment and Confirm Appointment
// @route   POST /api/appointments/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
    const { paymentIntentId, appointmentId } = req.body;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Retrieve PI from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            appointment.status = 'Confirmed';
            appointment.paymentStatus = 'Paid';
            appointment.razorpayPaymentId = paymentIntentId; // Use Stripe PI as ID
            await appointment.save();

            res.json({ message: "Payment verified successfully", appointment });
        } else {
            res.status(400).json({ message: "Payment not successful" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// @desc    Get my appointments (Patient & Doctor)
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patientId: req.user.id })
                .populate('doctorId', 'name email userId')
                .populate('patientId', 'name email')
                .sort({ date: 1 });
        } else if (req.user.role === 'doctor') {
            appointments = await Appointment.find({ doctorId: req.user.id })
                .populate('patientId', 'name email')
                .sort({ date: 1 });
        } else {
            return res.status(400).json({ message: 'Not authorized' });
        }
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update appointment status (Doctor/Admin)
// @route   PUT /api/appointments/:id/status
// @access  Private
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // CANCELLATION LOGIC (5-Hour Window)
        if (status === 'Cancelled') {
            const appointmentDateTime = new Date(appointment.date);
            const [hours, mins] = appointment.timeSlot.split(':');
            appointmentDateTime.setHours(parseInt(hours), parseInt(mins), 0, 0);

            const now = new Date();
            const diffMs = appointmentDateTime - now;
            const diffHours = diffMs / (1000 * 60 * 60);

            if (diffHours < 5 && req.user.role === 'patient') {
                return res.status(400).json({ message: 'Cancellations allowed only up to 5 hours before.' });
            }
        }

        // Verify ownership (Doctor/Patient) or Admin
        if (req.user.role === 'admin') {
            // Admin can do anything
        } else if (req.user.role === 'doctor') {
            if (appointment.doctorId.toString() !== req.user.id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
        } else if (req.user.role === 'patient') {
            if (appointment.patientId.toString() !== req.user.id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }
            if (status !== 'Cancelled') {
                return res.status(400).json({ message: 'Patients can only cancel appointments' });
            }
        } else {
            return res.status(401).json({ message: 'Not authorized' });
        }

        appointment.status = status;
        if (status === 'Cancelled' && appointment.paymentStatus === 'Paid') {
            appointment.paymentStatus = 'Refunded'; // Placeholder
        }

        await appointment.save();
        res.json(appointment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all appointments (Admin)
// @route   GET /api/appointments/admin/all
// @access  Private (Admin)
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({})
            .populate('doctorId', 'name email')
            .populate('patientId', 'name email')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    verifyPayment,
    getAllAppointments
};
