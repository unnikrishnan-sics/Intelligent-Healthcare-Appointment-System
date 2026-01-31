const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, updateDoctorProfile, getDoctorProfile, getDoctorPatients, getPatientHistory } = require('../controllers/doctorController');
const { protect, doctor } = require('../middleware/authMiddleware');

router.get('/', getDoctors);
router.post('/profile', protect, doctor, updateDoctorProfile);
router.get('/profile', protect, doctor, getDoctorProfile);
router.get('/patients', protect, doctor, getDoctorPatients);
router.get('/patients/:patientId/history', protect, doctor, getPatientHistory);
router.get('/:id', getDoctorById);

module.exports = router;
