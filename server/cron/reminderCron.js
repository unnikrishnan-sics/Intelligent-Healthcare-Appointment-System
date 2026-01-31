const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendReminder } = require('../utils/emailService');

const startReminderJob = () => {
    // Run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        console.log('--- Running Reminder Cron Job ---');
        try {
            const now = new Date();
            const threeHoursLater = new Date(now.getTime() + 3 * 60 * 60 * 1000);

            // Allow a buffer (e.g., appointments starting between 2h 50m and 3h 10m from now)
            const startTimeBuffer = new Date(threeHoursLater.getTime() - 20 * 60 * 1000);
            const endTimeBuffer = new Date(threeHoursLater.getTime() + 20 * 60 * 1000);

            // Find appointments that match criteria
            // We need to match the ISO date + time string logic or similar.
            // Our Appointment 'date' is usually just the date part (00:00:00).
            // 'timeSlot' is 'HH:mm'.
            // So we must construct the full DateTime for comparison.

            // Since filtering by constructed field in query is hard, let's fetch pending/confirmed appointments for 'today' (and maybe 'tomorrow' if near midnight)

            // Simplified approach: Get all 'Confirmed/Pending' appointments for the relevant DATEs and filter in JS
            // This is acceptable for typical load.

            const relevantAppointments = await Appointment.find({
                status: { $in: ['Confirmed', 'Pending'] },
                reminded: false
                // Optimally filter by date >= today
            }).populate('patientId', 'name email');

            for (let apt of relevantAppointments) {
                // Construct apt specific Date Object
                const [hours, mins] = apt.timeSlot.split(':');
                const aptDateTime = new Date(apt.date);
                aptDateTime.setHours(parseInt(hours), parseInt(mins), 0, 0);

                const diffMs = aptDateTime - now;
                const matchHours = diffMs / (1000 * 60 * 60);

                // If appointment is roughly 3 hours away (e.g. between 2.8 and 3.2 hours)
                if (matchHours >= 2.8 && matchHours <= 3.2) {
                    console.log(`Sending reminder for Apt #${apt.tokenNumber}`);

                    if (apt.patientId && apt.patientId.email) {
                        await sendReminder(apt.patientId, apt);
                        apt.reminded = true;
                        await apt.save();
                    }
                }
            }

        } catch (error) {
            console.error('Error in Reminder Cron:', error);
        }
    });
};

module.exports = startReminderJob;
