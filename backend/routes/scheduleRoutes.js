const express = require('express');
const {
  createSchedule,
  getSchedules,
  deleteSchedule,
  createHoliday,
  getHolidays
} = require('../controllers/adminScheduleController');

const auth = require('../middelware/auth');
// const checkRole = require('../middleware/role'); // إن أحببت منع غير الأدمن

const router = express.Router();

// جدول الطبيب
router.post('/doctor-schedule', auth, createSchedule);
router.get('/doctor-schedule/:doctorId', auth, getSchedules);
router.delete('/doctor-schedule/:id', auth, deleteSchedule);

// أيام العطل
router.post('/holiday', auth, createHoliday);
router.get('/holidays', auth, getHolidays);

module.exports = router;
