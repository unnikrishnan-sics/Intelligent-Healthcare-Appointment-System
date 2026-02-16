const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './server/.env' });

const User = require('./server/models/User');
const Doctor = require('./server/models/Doctor');
const Appointment = require('./server/models/Appointment');

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ihas_db');
        console.log('Connected to MongoDB');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Doctor.deleteMany({});
        await Appointment.deleteMany({});
        console.log('Data cleared.');

        const salt = await bcrypt.genSalt(10);
        const hashedAdminPassword = await bcrypt.hash('admin@123', salt);
        const hashedUserPassword = await bcrypt.hash('password123', salt);

        // 1. Create Admin
        console.log('Creating Admin...');
        const admin = await User.create({
            name: 'System Administrator',
            email: 'admin@gmail.com',
            password: hashedAdminPassword,
            role: 'admin',
            status: 'active'
        });

        // 2. Create Doctors
        console.log('Creating Doctors and Profiles...');
        const doctorData = [
            {
                name: 'Dr. Sarah Wilson',
                email: 'sarah.wilson@hospital.com',
                specialization: 'Cardiology',
                experience: 12,
                fees: 150,
                bio: 'Senior cardiologist with expertise in interventional cardiology and heart failure management.',
                availability: [
                    { day: 'Monday', startTime: '09:00', endTime: '13:00' },
                    { day: 'Wednesday', startTime: '14:00', endTime: '18:00' },
                    { day: 'Friday', startTime: '09:00', endTime: '13:00' }
                ]
            },
            {
                name: 'Dr. James Miller',
                email: 'james.miller@hospital.com',
                specialization: 'Dermatology',
                experience: 8,
                fees: 100,
                bio: 'Specialist in skin disorders, aesthetics, and laser treatments.',
                availability: [
                    { day: 'Tuesday', startTime: '10:00', endTime: '17:00' },
                    { day: 'Thursday', startTime: '10:00', endTime: '17:00' }
                ]
            },
            {
                name: 'Dr. Emily Chen',
                email: 'emily.chen@hospital.com',
                specialization: 'Pediatrics',
                experience: 15,
                fees: 120,
                bio: 'Compassionate pediatrician focused on adolescent health and nutrition.',
                availability: [
                    { day: 'Monday', startTime: '08:00', endTime: '12:00' },
                    { day: 'Tuesday', startTime: '08:00', endTime: '12:00' },
                    { day: 'Wednesday', startTime: '08:00', endTime: '12:00' },
                    { day: 'Thursday', startTime: '08:00', endTime: '12:00' }
                ]
            }
        ];

        const createdDoctors = [];
        for (const dr of doctorData) {
            const user = await User.create({
                name: dr.name,
                email: dr.email,
                password: hashedUserPassword,
                role: 'doctor',
                status: 'active'
            });

            const profile = await Doctor.create({
                userId: user._id,
                specialization: dr.specialization,
                bio: dr.bio,
                experience: dr.experience,
                feesPerConsultation: dr.fees,
                availability: dr.availability
            });

            createdDoctors.push({ user, profile });
        }

        // 3. Create Patients
        console.log('Creating Patients...');
        const patientData = [
            { name: 'John Doe', email: 'john@example.com' },
            { name: 'Jane Smith', email: 'jane@example.com' }
        ];

        const createdPatients = [];
        for (const p of patientData) {
            const user = await User.create({
                name: p.name,
                email: p.email,
                password: hashedUserPassword,
                role: 'patient',
                status: 'active'
            });
            createdPatients.push(user);
        }

        // 4. Create Appointments
        console.log('Creating Appointments...');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        await Appointment.create({
            patientId: createdPatients[0]._id,
            doctorId: createdDoctors[0].user._id,
            date: today,
            timeSlot: '10:00 AM',
            status: 'Confirmed',
            paymentStatus: 'Paid',
            tokenNumber: 1
        });

        await Appointment.create({
            patientId: createdPatients[1]._id,
            doctorId: createdDoctors[1].user._id,
            date: tomorrow,
            timeSlot: '11:30 AM',
            status: 'Pending',
            paymentStatus: 'Pending'
        });

        console.log('Data seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
