const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

// @desc    Create a new prescription
// @route   POST /api/prescriptions
// @access  Private (Doctor only)
const createPrescription = async (req, res) => {
    const { appointmentId, patientId, medicines, notes } = req.body;

    try {
        // Verify appointment exists and belongs to doctor
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.doctorId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const prescription = await Prescription.create({
            appointmentId,
            doctorId: req.user.id,
            patientId,
            medicines,
            notes
        });

        res.status(201).json(prescription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get prescription by appointment ID
// @route   GET /api/prescriptions/:appointmentId
// @access  Private (Doctor/Patient/Admin)
const getPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findOne({ appointmentId: req.params.appointmentId })
            .populate('doctorId', 'name')
            .populate('patientId', 'name');

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        // Access Control
        if (req.user.role !== 'admin' &&
            req.user.id !== prescription.doctorId._id.toString() &&
            req.user.id !== prescription.patientId._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(prescription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createPrescription,
    getPrescription
};
