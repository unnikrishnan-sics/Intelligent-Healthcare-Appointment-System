const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: {
        type: String,
        required: [true, 'Please add specialization'],
        match: [
            /^[a-zA-Z\s\-\&]+$/,
            'Specialization should only contain letters, spaces, and hyphens'
        ]
    },
    bio: {
        type: String,
        required: [true, 'Please add bio']
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    feesPerConsultation: {
        type: Number,
        required: [true, 'Please add consultation fees']
    },
    availability: [{
        day: { type: String, required: true }, // e.g., 'Monday'
        startTime: { type: String, required: true }, // '09:00'
        endTime: { type: String, required: true } // '17:00'
    }],

    // QUEUE MANAGEMENT STATE
    queueState: {
        isPaused: { type: Boolean, default: false },
        currentSession: { type: String }, // e.g., "Monday - Morning"
        lastTokenCalled: { type: Number, default: 0 }
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);
