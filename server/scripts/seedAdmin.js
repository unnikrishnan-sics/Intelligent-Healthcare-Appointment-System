const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

const seedAdmin = async () => {
    try {
        // Ensure DB is connected (will use cached connection)
        await connectDB();

        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            // Silently return if admin exists
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await User.create({
            name: 'System Admin',
            email: 'admin@ihas.com',
            password: hashedPassword,
            role: 'admin',
            status: 'active',
            address: 'System HQ'
        });

        console.log('Seed: Default Admin created (admin@ihas.com).');
    } catch (error) {
        console.error('Seed Error:', error.message);
    }
};

module.exports = seedAdmin;
