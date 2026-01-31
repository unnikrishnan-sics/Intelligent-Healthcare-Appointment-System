const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Connect Database
// Connect Database (Serverless: Call inside middleware or functions)
// connectDB(); // Removed top-level call

const app = express();

// Middleware
const corsOptions = {
    origin: ['https://ihasfrontend.vercel.app', 'http://localhost:5173', 'http://localhost:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Enable pre-flight for all routes
app.use(express.json());

// DB Connection Middleware
app.use(async (req, res, next) => {
    await connectDB();
    await seedAdmin(); // Run seed check (safe due to internal caching)
    next();
});

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/queue', require('./routes/queueRoutes')); // Queue Routes

const PORT = process.env.PORT || 5000;

const seedAdmin = require('./scripts/seedAdmin');
const startReminderJob = require('./cron/reminderCron');

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    seedAdmin(); // Auto-seed on local startup
    startReminderJob(); // Start Cron Job
});

module.exports = app;
