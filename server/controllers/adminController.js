const User = require('../models/User');

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

        await user.deleteOne();
        res.json({ message: 'User removed' });
    } catch (error) {
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

module.exports = {
    getAllUsers,
    updateUserStatus,
    deleteUser,
    getSystemStats
};
