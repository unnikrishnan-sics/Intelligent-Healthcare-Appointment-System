const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

let isSeeded = false;

const seedAdmin = async () => {
    if (isSeeded) return;

    try {
        // Ensure DB is connected (will use cached connection)
        await connectDB();

        // Double check flag after await to handle race conditions slightly better (though node is single threaded)
        if (isSeeded) return;

        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            // Silently return if admin exists
            isSeeded = true;
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
        isSeeded = true;
    } catch (error) {
        console.error('Seed Error:', error.message);
    }
};

module.exports = seedAdmin;
