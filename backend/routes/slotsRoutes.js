const express = require('express');
const router = express.Router();
const { getAvailableSlots, bookSlot } = require('../controllers/slotsController');
const auth= require('../middleware/auth');

router.get('/', auth, getAvailableSlots); // ?doctorId=&date=
router.post('/book', auth, bookSlot);

module.exports = router;
