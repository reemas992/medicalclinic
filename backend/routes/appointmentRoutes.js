const express = require('express');
const { 
  bookAppointment, 
  cancelAppointment, 
  getMyAppointments, 
  getAllAppointments, 
  updateAppointmentStatus 
} = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

// Book appointment (patient)
router.post('/', auth, bookAppointment);

// Cancel appointment (patient or admin)
router.put('/:id/cancel', auth, cancelAppointment);

// Get my appointments (patient or doctor)
router.get('/my', auth, getMyAppointments);

// Get all appointments (admin only)
router.get('/', auth, requireRole('admin'), getAllAppointments);

// Update appointment status (admin only)
router.put('/:id/status', auth, requireRole('admin'), updateAppointmentStatus);

module.exports = router;