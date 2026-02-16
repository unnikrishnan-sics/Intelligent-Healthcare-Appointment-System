const mongoose = require('mongoose');

const checkCounts = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/ihas_db');

        const usersCount = await mongoose.connection.db.collection('users').countDocuments({ role: 'doctor' });
        console.log(`Doctor Users Count: ${usersCount}`);

        const doctorsCount = await mongoose.connection.db.collection('doctors').countDocuments();
        console.log(`Doctor Profiles Count: ${doctorsCount}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkCounts();
