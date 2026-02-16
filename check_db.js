const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const checkDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ihas_db');
        console.log('Connected to MongoDB');

        const User = require('./server/models/User');
        const Doctor = require('./server/models/Doctor');

        const doctorUsers = await User.find({ role: 'doctor' }).select('name email role status');
        console.log('\n--- Doctor Users ---');
        console.log(doctorUsers);

        const doctorProfiles = await Doctor.find({});
        console.log('\n--- Doctor Profiles ---');
        console.log(doctorProfiles);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkDB();
