const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE, // e.g., 'gmail'
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `"${process.env.FROM_NAME}" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        return null;
    }
};

const sendBookingReceipt = async (user, appointment) => {
    const subject = `Appointment Confirmation - Token #${appointment.tokenNumber}`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Appointment Confirmed!</h2>
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>Your appointment has been successfully booked.</p>
            
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Token Number:</strong> <span style="font-size: 18px; font-weight: bold;">#${appointment.tokenNumber}</span></p>
                <p><strong>Date:</strong> ${new Date(appointment.date).toDateString()}</p>
                <p><strong>Details:</strong> ${appointment.timeSlot}</p>
                <p><strong>Status:</strong> ${appointment.status}</p>
            </div>

            <p>Please arrive 10 minutes before your scheduled time.</p>
            <p>Thank you for choosing IHAS.</p>
        </div>
    `;

    return sendEmail({ to: user.email, subject, html });
};

const sendReminder = async (user, appointment) => {
    const subject = `Reminder: Appointment in 3 Hours`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #d97706;">Appointment Reminder</h2>
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>This is a gentle reminder that you have an appointment coming up in approximately 3 hours.</p>
            
            <div style="background: #fff7ed; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fdba74;">
                 <p><strong>Token Number:</strong> #${appointment.tokenNumber}</p>
                 <p><strong>Time:</strong> ${appointment.timeSlot}</p>
            </div>

            <p>Please check your dashboard for more details.</p>
        </div>
    `;

    return sendEmail({ to: user.email, subject, html });
};

module.exports = {
    sendEmail,
    sendBookingReceipt,
    sendReminder
};
