const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const { getAllUsers, updateUserStatus, deleteUser, getSystemStats, addDoctor, getReports, getDoctorPatients, getExportAppointments } = require('../controllers/adminController');

router.get('/stats', protect, admin, getSystemStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/reports', protect, admin, getReports);
router.get('/doctors/:id/patients', protect, admin, getDoctorPatients);
router.get('/export-appointments', protect, admin, getExportAppointments);
router.put('/users/:id/status', protect, admin, updateUserStatus);
router.delete('/users/:id', protect, admin, deleteUser);
router.post('/doctors', protect, admin, addDoctor);


module.exports = router;
