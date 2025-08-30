// routes/slotRoutes.js
const express = require('express');
const router = express.Router();
const { getAvailableSlots } = require('../controllers/slotController');
const auth = require('../middleware/auth');

router.get('/:doctorId', auth, getAvailableSlots);

module.exports = router;
