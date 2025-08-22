const express = require('express');
const { 
  createSchedule, 
  getSchedules, 
  deleteSchedule, 
  createHoliday, 
  getHolidays 
} = require('../controllers/scheduleController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

// Doctor schedules
router.post('/doctor-schedule', auth, createSchedule);
router.get('/doctor-schedule/:doctorId', auth, getSchedules);
router.delete('/doctor-schedule/:id', auth, deleteSchedule);

// Holidays
router.post('/holiday', auth, requireRole('admin'), createHoliday);
router.get('/holidays', auth, getHolidays);

module.exports = router;