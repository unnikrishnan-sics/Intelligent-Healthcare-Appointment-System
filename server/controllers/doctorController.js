const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        const doctors = await Doctor.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $lookup: {
                    from: 'appointments',
                    let: { doctorId: '$userId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$doctorId', '$$doctorId'] },
                                        { $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$date" } }, today] },
                                        { $in: ['$status', ['Confirmed', 'Pending', 'Completed']] } // Include Completed to get total queue size
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'todayAppointments'
                }
            },
            // Add lookup for the *current* active appointment to check if it's completed
            {
                $lookup: {
                    from: 'appointments',
                    let: {
                        doctorId: '$userId',
                        lastToken: '$queueState.lastTokenCalled'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$doctorId', '$$doctorId'] },
                                        { $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$date" } }, today] },
                                        { $eq: ['$tokenNumber', '$$lastToken'] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'currentAppointment'
                }
            },
            // Lookup the REAL next patient based on Priority (Critical first)
            {
                $lookup: {
                    from: 'appointments',
                    let: { doctorId: '$userId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$doctorId', '$$doctorId'] },
                                        { $eq: [{ $dateToString: { format: "%Y-%m-%d", date: "$date" } }, today] },
                                        { $in: ['$status', ['Confirmed', 'Pending']] },
                                        { $eq: ['$queueStatus', 'Waiting'] }
                                    ]
                                }
                            }
                        },
                        // Sort by Priority (Critical < Normal) then Token ID (Asc)
                        { $sort: { priority: 1, tokenNumber: 1 } },
                        { $limit: 1 }
                    ],
                    as: 'nextQueueItem'
                }
            },
            {
                $addFields: {
                    userId: '$user', // Restore original structure format
                    totalBookings: { $size: '$todayAppointments' },
                    isAvailableToday: {
                        $in: [dayName, '$availability.day']
                    },
                    // If lastTokenCalled > 0, check its status. If completed/skipped, currentStatus is 'Idle'
                    currentTokenStatus: {
                        $cond: {
                            if: { $gt: [{ $size: '$currentAppointment' }, 0] },
                            then: { $arrayElemAt: ['$currentAppointment.status', 0] },
                            else: 'Idle'
                        }
                    },
                    // Extract the calculated next token number (or null)
                    nextTokenNumber: {
                        $cond: {
                            if: { $gt: [{ $size: '$nextQueueItem' }, 0] },
                            then: { $arrayElemAt: ['$nextQueueItem.tokenNumber', 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $project: {
                    user: 0,
                    todayAppointments: 0,
                    currentAppointment: 0,
                    nextQueueItem: 0
                }
            }
        ]);

        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate('userId', 'name email');
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create/Update Doctor Profile
// @route   POST /api/doctors/profile
// @access  Private (Doctor only)
const updateDoctorProfile = async (req, res) => {
    const { specialization, bio, experience, feesPerConsultation, availability } = req.body;

    // Build profile object
    // Build profile object
    const profileFields = { userId: req.user._id };
    if (specialization) profileFields.specialization = specialization;
    if (bio) profileFields.bio = bio;
    if (experience) profileFields.experience = experience;
    if (feesPerConsultation) profileFields.feesPerConsultation = feesPerConsultation;
    if (availability) profileFields.availability = availability;

    try {
        let doctor = await Doctor.findOne({ userId: req.user._id });

        if (doctor) {
            // Update
            doctor = await Doctor.findOneAndUpdate(
                { userId: req.user._id },
                { $set: profileFields },
                { new: true, runValidators: true }
            );
            return res.json(doctor);
        }

        // Create - Ensure required fields are present if creating new
        // If they are missing, mongoose save() will throw a ValidationError
        doctor = new Doctor(profileFields);
        await doctor.save();
        res.json(doctor);

    } catch (error) {
        console.error('Error in updateDoctorProfile:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get current doctor profile
// @route   GET /api/doctors/profile
// @access  Private (Doctor only)
const getDoctorProfile = async (req, res) => {
    try {
        // Ensure user is authenticated (redundant if middleware works, but safe)
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (doctor) {
            res.json(doctor);
        } else {
            // Return empty profile or null instead of 404 to avoid console errors
            res.json(null);
        }
    } catch (error) {
        console.error('Error in getDoctorProfile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get unique patients for the current doctor
// @route   GET /api/doctors/patients
// @access  Private (Doctor only)
const getDoctorPatients = async (req, res) => {
    try {
        // Find all appointments for this doctor
        // We use aggregation to group by patientId to get unique patients
        const patients = await require('../models/Appointment').aggregate([
            { $match: { doctorId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: "$patientId", lastAppointmentDate: { $max: "$date" } } },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'patientDetails' } },
            { $unwind: "$patientDetails" },
            {
                $project: {
                    _id: "$patientDetails._id",
                    name: "$patientDetails.name",
                    email: "$patientDetails.email",
                    age: "$patientDetails.age",
                    gender: "$patientDetails.gender",
                    phone: "$patientDetails.phone",
                    lastVisit: "$lastAppointmentDate"
                }
            },
            { $sort: { lastVisit: -1 } }
        ]);

        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get detailed history of a patient
// @route   GET /api/doctors/patients/:patientId/history
// @access  Private (Doctor)
const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        // Simple find works here because mongoose casts string ID for find()
        const history = await require('../models/Appointment').find({
            doctorId: req.user.id,
            patientId: patientId
        }).populate('patientId', 'name email').sort({ date: -1 });

        res.json(history);
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDoctors,
    getDoctorById,
    updateDoctorProfile,
    getDoctorProfile,
    getDoctorPatients,
    getPatientHistory
};
