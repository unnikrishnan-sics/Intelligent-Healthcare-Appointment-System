const express = require('express');
const router = express.Router();
const { createPrescription, getPrescription } = require('../controllers/prescriptionController');
const { protect, doctor } = require('../middleware/authMiddleware');

router.post('/', protect, doctor, createPrescription);
router.get('/:appointmentId', protect, getPrescription);

module.exports = router;
