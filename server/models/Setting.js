const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    theme: {
        primaryColor: { type: String, default: '#0ea5e9' }, // Sky 500
        secondaryColor: { type: String, default: '#64748b' }, // Slate 500
        accentColor: { type: String, default: '#f43f5e' }, // Rose 500
        darkMode: { type: Boolean, default: false },
        logoUrl: { type: String, default: '' }
    },
    hospitalName: { type: String, default: 'IHAS Healthcare' },
    contactEmail: { type: String, default: 'admin@ihas.com' },
    contactPhone: { type: String, default: '' },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Setting', settingSchema);
