const Appointment = require('../models/Appointment');

/**
 * Calculate No-Show Probability Score
 * @param {string} patientId - ID of the patient
 * @param {string} date - Appointment date string
 * @param {string} timeSlot - Appointment time slot
 * @returns {Promise<{score: number, factors: string[]}>}
 */
const calculateNoShowRisk = async (patientId, date, timeSlot) => {
    let score = 0;
    const factors = [];

    // 1. Historical Analysis
    const history = await Appointment.find({ patientId });
    const totalAppointments = history.length;

    if (totalAppointments > 0) {
        const noShows = history.filter(a => a.status === 'No-Show').length;
        const cancelled = history.filter(a => a.status === 'Cancelled').length;

        const noShowRate = (noShows / totalAppointments) * 100;
        const cancelRate = (cancelled / totalAppointments) * 100;

        if (noShowRate > 20) {
            score += 40;
            factors.push('High No-Show History');
        } else if (noShowRate > 0) {
            score += 20;
            factors.push('Past No-Show Record');
        }

        if (cancelRate > 50) {
            score += 15;
            factors.push('Frequent Cancellations');
        }
    } else {
        // New patient slight risk
        score += 10;
        factors.push('New Patient');
    }

    // 2. Temporal Factors (Heuristics)
    const day = new Date(date).getDay(); // 0 = Sun, 1 = Mon ...

    // Mondays (1) and Fridays (5) might have higher drop rates
    if (day === 1 || day === 5) {
        score += 5;
        factors.push('High-Traffic Day');
    }

    // Weekend appointments
    if (day === 0 || day === 6) {
        score += 10;
        factors.push('Weekend Slot');
    }

    // Early Morning or Late Evening
    const hour = parseInt(timeSlot.split(':')[0]);
    if (hour < 9) {
        score += 5;
        factors.push('Early Morning Slot');
    }
    if (hour >= 17) {
        score += 5;
        factors.push('Late Evening Slot');
    }

    // Cap score at 100
    return {
        score: Math.min(score, 100),
        factors
    };
};

module.exports = { calculateNoShowRisk };
