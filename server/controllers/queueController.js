const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Get Today's Queue for a Doctor
// @route   GET /api/queue/:doctorId
// @access  Private (Doctor/Admin/Patient - restricted data)
const getQueue = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const today = new Date().toISOString().split('T')[0];

        // 1. Fetch Appointments for Today
        // 1. Fetch Appointments for Today
        // Filter: Must be 'Confirmed' (Paid) AND not Cancelled/Rejected.
        const appointments = await Appointment.find({
            doctorId,
            date: today,
            status: 'Confirmed'
        })
            .populate('patientId', 'name age gender')
            .sort({ priority: 1, tokenNumber: 1 }); // Critical first (alpha sort C < N), then Token

        // 2. Automated Stale Check (The "15 min" rule)
        // If status is 'In-Consultation' for > 15 mins (and no update), mark 'Skipped' or notify?
        // User asked: "mark defaultly as not present in 15 minutes"
        const now = new Date();
        const updatedAppointments = [];

        for (let appt of appointments) {
            if (appt.queueStatus === 'In-Consultation' && appt.consultationStartTime) {
                const diffMs = now - new Date(appt.consultationStartTime);
                const diffMins = diffMs / (1000 * 60);

                if (diffMins > 15) {
                    // Auto-mark as Skipped/Not Present
                    appt.queueStatus = 'Skipped';
                    await appt.save();
                }
            }
            updatedAppointments.push(appt);
        }

        // 3. Get Doctor Queue State
        const doctor = await Doctor.findOne({ userId: doctorId }).select('queueState');

        res.json({
            queue: updatedAppointments,
            queueState: doctor ? doctor.queueState : {}
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Queue Status (Call Next, Wait, etc.)
// @route   PUT /api/queue/status
// @access  Private (Doctor)
const updateQueueStatus = async (req, res) => {
    const { appointmentId, status } = req.body; // status: In-Consultation, Completed, Skipped

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        appointment.queueStatus = status;

        if (status === 'In-Consultation') {
            appointment.consultationStartTime = new Date();

            // Update Doctor's "Last Called Token"
            await Doctor.findOneAndUpdate(
                { userId: req.user.id },
                { 'queueState.lastTokenCalled': appointment.tokenNumber }
            );
        } else if (status === 'Completed') {
            appointment.status = 'Completed';
        }

        await appointment.save();
        res.json(appointment);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle Priority (Critical <-> Normal)
// @route   PUT /api/queue/priority
// @access  Private (Doctor)
const togglePriority = async (req, res) => {
    const { appointmentId } = req.body;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Not found' });

        appointment.priority = appointment.priority === 'Normal' ? 'Critical' : 'Normal';
        await appointment.save();

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Doctor Session Control (Pause/Resume)
// @route   PUT /api/queue/control
// @access  Private (Doctor)
const updateQueueControl = async (req, res) => {
    const { isPaused } = req.body;

    try {
        const doctor = await Doctor.findOneAndUpdate(
            { userId: req.user.id },
            { 'queueState.isPaused': isPaused },
            { new: true }
        );
        res.json(doctor.queueState);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getQueue,
    updateQueueStatus,
    togglePriority,
    updateQueueControl
};
