const express = require('express');
const router = express.Router();
const { protect, doctor } = require('../middleware/authMiddleware');
const {
    getQueue,
    updateQueueStatus,
    togglePriority,
    updateQueueControl
} = require('../controllers/queueController');

// All routes are protected
router.use(protect);

// Get Queue (Doctor sees controls, Patient sees display)
router.get('/:doctorId', getQueue);

// Doctor Actions
router.put('/status', doctor, updateQueueStatus);
router.put('/priority', doctor, togglePriority);
router.put('/control', doctor, updateQueueControl);

module.exports = router;
