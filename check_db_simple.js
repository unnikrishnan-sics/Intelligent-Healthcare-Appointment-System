const mongoose = require('mongoose');

const checkDB = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect('mongodb://127.0.0.1:27017/ihas_db');
        console.log('Connected!');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const usersCount = await mongoose.connection.db.collection('users').countDocuments();
        console.log('Users count:', usersCount);

        const doctorsCount = await mongoose.connection.db.collection('doctors').countDocuments();
        console.log('Doctors count:', doctorsCount);

        const doctors = await mongoose.connection.db.collection('users').find({ role: 'doctor' }).toArray();
        console.log('Doctors from Users collection:', doctors);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkDB();
