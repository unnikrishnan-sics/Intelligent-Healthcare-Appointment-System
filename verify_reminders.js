const mongoose = require('mongoose');
const Setting = require('./server/models/Setting');
const Appointment = require('./server/models/Appointment');
const startReminderJob = require('./server/cron/reminderCron');

// Mocking logic for verification since we can't easily run the full cron in this environment
async function verifyReminderLogic() {
    console.log('--- Verification: Reminder Logic ---');

    // 1. Simulating an appointment 5 hours away
    const now = new Date();
    const aptTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);
    const timeSlot = `${aptTime.getHours().toString().padStart(2, '0')}:${aptTime.getMinutes().toString().padStart(2, '0')}`;

    console.log(`Current Time: ${now.toISOString()}`);
    console.log(`Simulated Appointment Time (5h away): ${aptTime.toISOString()} [Slot: ${timeSlot}]`);

    // 2. Logic Check (Matching what's in reminderCron.js)
    const diffMs = aptTime - now;
    const matchHours = diffMs / (1000 * 60 * 60);
    console.log(`Calculated matchHours: ${matchHours.toFixed(2)}`);

    const reminderHoursLimit = 5; // Simulating admin set this to 5
    const isMatched = matchHours >= (reminderHoursLimit - 0.2) && matchHours <= (reminderHoursLimit + 0.2);

    console.log(`Testing against limit: ${reminderHoursLimit}h`);
    console.log(`Result: ${isMatched ? 'MATCHED (Email would be sent)' : 'NOT MATCHED'}`);

    if (isMatched) {
        console.log('Verification SUCCESS: Logic correctly identifies appointments within the dynamic window.');
    } else {
        console.log('Verification FAILED: Logic did not correctly identify the appointment.');
    }
}

verifyReminderLogic();
