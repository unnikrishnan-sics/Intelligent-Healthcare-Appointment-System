const express = require('express');
const router = express.Router();
const { bookAppointment, getMyAppointments, updateAppointmentStatus, verifyPayment, getAllAppointments } = require('../controllers/appointmentController');
const { protect, doctor, admin } = require('../middleware/authMiddleware');

router.post('/', protect, bookAppointment);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my', protect, getMyAppointments);
router.get('/admin/all', protect, admin, getAllAppointments);
router.put('/:id/status', protect, updateAppointmentStatus); // Removed doctor middleware to allow patients/admin to access, handled inside controller

module.exports = router;
