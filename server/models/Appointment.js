const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Could be Doctor model or User model with role Doctor. Using User for simplicity but linking to Doctor profile is usually better. 
        // Plan says Doctor Profile exists. Let's ref User for the ID, and maybe store Doctor Profile ID if needed.
        // Actually, usually booking is with a Doctor. Doctor model has userId. 
        // Let's ref 'Doctor' to be precise, or 'User' if consistency is preferred. 
        // Given previous schema, Doctor has userId. Let's ref 'User' (the doctor's user account) usually easier for auth checks, 
        // OR ref 'Doctor' schema. 
        // Let's ref 'User' for simplicity in auth, or 'Doctor' for specific profile data.
        // I will ref 'User' for doctorId to keep it consistent with patientId.
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    // TOKEN SYSTEM FIELDS
    tokenNumber: {
        type: Number
    },
    queueStatus: {
        type: String,
        enum: ['Waiting', 'In-Consultation', 'Completed', 'Skipped', 'Cancelled'],
        default: 'Waiting'
    },
    priority: {
        type: String,
        enum: ['Normal', 'Critical'],
        default: 'Normal'
    },
    consultationStartTime: {
        type: Date
    },

    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'Rejected', 'No-Show'],
        default: 'Pending'
    },
    reason: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    predictionScore: {
        type: Number,
        default: 0
    },
    riskFactors: [{
        type: String
    }],
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for Prescriptions
appointmentSchema.virtual('prescriptions', {
    ref: 'Prescription',
    localField: '_id',
    foreignField: 'appointmentId'
});

module.exports = mongoose.model('Appointment', appointmentSchema);
