const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { sendReminder, sendDayBeforeReminder } = require('../utils/emailService');

const startReminderJob = () => {
    // Run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        console.log('--- Running Reminder Cron Job ---');
        try {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowDateStr = tomorrow.toISOString().split('T')[0];

            // 1. Handle "Day Before" Reminders
            // We want to notify users whose appointment is tomorrow.
            // We only send it once using the 'dayBeforeReminded' flag.
            const tomorrowAppointments = await Appointment.find({
                status: { $in: ['Confirmed', 'Pending'] },
                dayBeforeReminded: false,
                date: {
                    $gte: new Date(tomorrowDateStr),
                    $lt: new Date(new Date(tomorrowDateStr).getTime() + 24 * 60 * 60 * 1000)
                }
            }).populate('patientId', 'name email');

            for (let apt of tomorrowAppointments) {
                console.log(`Sending Day-Before reminder for Apt #${apt.tokenNumber}`);
                if (apt.patientId && apt.patientId.email) {
                    await sendDayBeforeReminder(apt.patientId, apt);
                    apt.dayBeforeReminded = true;
                    await apt.save();
                }
            }

            // 2. Handle "3 Hours Before" Reminders (Existing Logic)
            const recentAppointments = await Appointment.find({
                status: { $in: ['Confirmed', 'Pending'] },
                reminded: false
                // Filter by date >= today to optimize
            }).populate('patientId', 'name email');

            for (let apt of recentAppointments) {
                const [hours, mins] = apt.timeSlot.split(':');
                const aptDateTime = new Date(apt.date);
                aptDateTime.setHours(parseInt(hours), parseInt(mins), 0, 0);

                const diffMs = aptDateTime - now;
                const matchHours = diffMs / (1000 * 60 * 60);

                // If appointment is roughly 3 hours away (between 2.8 and 3.2 hours)
                if (matchHours >= 2.8 && matchHours <= 3.2) {
                    console.log(`Sending 3hr reminder for Apt #${apt.tokenNumber}`);
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
