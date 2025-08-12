const express = require('express');
const { bookAppointment, cancelAppointment, getMyAppointments } = require('../controllers/appointmentController');
const auth = require('../middelware/auth');
const router = express.Router();

router.post('/', auth, bookAppointment); // ← هنا الدالة bookAppointment يجب أن تكون function
router.put('/:id/cancel', auth, cancelAppointment);
router.get('/my', auth, getMyAppointments);

module.exports = router;
