const User = require('../models/User');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');


// @desc    Get all users (with filtering)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user status (Approve/Reject)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = status;
        await user.save();

        res.json({ message: `User status updated to ${status}`, user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If user is a doctor, delete their doctor profile too
        if (user.role === 'doctor') {
            const Doctor = require('../models/Doctor');
            await Doctor.findOneAndDelete({ userId: user._id });
        }

        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
        console.error('Delete User Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get System Stats (Dashboard)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
    try {
        const Appointment = require('../models/Appointment');
        const Doctor = require('../models/Doctor');

        // Count Patients (Users with role 'patient')
        const patients = await User.countDocuments({ role: 'patient' });

        // Count Doctors (Users with role 'doctor' or Doctor profiles)
        // Using User model for role 'doctor' to match active logic
        const doctors = await User.countDocuments({ role: 'doctor' });

        // Count Appointments
        const appointments = await Appointment.countDocuments({});

        res.json({
            patients,
            doctors,
            appointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Admin add new doctor
// @route   POST /api/admin/doctors
// @access  Private/Admin
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, specialization, bio, experience, feesPerConsultation, address, phone, gender, dob } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'doctor',
            status: 'active',
            address: address || '',
            phone: phone || '',
            gender: gender || 'Other',
            dob: dob || null
        });

        const doctor = await Doctor.create({
            userId: user._id,
            specialization,
            bio,
            experience,
            feesPerConsultation
        });

        res.status(201).json({
            message: 'Doctor created successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            },
            doctor
        });
    } catch (error) {
        console.error('Add Doctor Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Detailed Reports (Patients + Doctors)
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res) => {
    try {
        const patients = await User.find({ role: 'patient' }).sort({ createdAt: -1 });

        // Fetch doctors and their profiles
        const doctorUsers = await User.find({ role: 'doctor' }).sort({ createdAt: -1 });
        const doctorIds = doctorUsers.map(d => d._id);
        const doctorProfiles = await Doctor.find({ userId: { $in: doctorIds } });

        const detailedDoctors = doctorUsers.map(user => {
            const profile = doctorProfiles.find(p => p.userId.toString() === user._id.toString());
            return {
                ...user.toObject(),
                specialization: profile ? profile.specialization : 'N/A',
                experience: profile ? profile.experience : 0,
                fees: profile ? profile.feesPerConsultation : 0
            };
        });

        res.json({
            patients,
            doctors: detailedDoctors
        });
    } catch (error) {
        console.error('Get Reports Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get patients who have appointments with a specific doctor
// @route   GET /api/admin/doctors/:id/patients
// @access  Private/Admin
const getDoctorPatients = async (req, res) => {
    try {
        const Appointment = require('../models/Appointment');
        const appointments = await Appointment.find({ doctorId: req.params.id })
            .populate('patientId', 'name email phone gender dob');

        // Get unique patients
        const patientsMap = new Map();
        appointments.forEach(apt => {
            if (apt.patientId && !patientsMap.has(apt.patientId._id.toString())) {
                patientsMap.set(apt.patientId._id.toString(), apt.patientId);
            }
        });

        res.json(Array.from(patientsMap.values()));
    } catch (error) {
        console.error('Get Doctor Patients Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get appointments for export (Doctor + Patient filter)
// @route   GET /api/admin/export-appointments
// @access  Private/Admin
const getExportAppointments = async (req, res) => {
    try {
        const { doctorId, patientId } = req.query;
        const Appointment = require('../models/Appointment');

        const query = {};
        if (doctorId) query.doctorId = doctorId;
        if (patientId) query.patientId = patientId;

        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email')
            .populate('doctorId', 'name')
            .sort({ date: -1 });

        res.json(appointments);
    } catch (error) {
        console.error('Get Export Appointments Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAllUsers,
    updateUserStatus,
    deleteUser,
    getSystemStats,
    addDoctor,
    getReports,
    getDoctorPatients,
    getExportAppointments
};



