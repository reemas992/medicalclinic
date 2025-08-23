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

// Get all schedules (admin only)
router.get('/doctor-schedule', auth, requireRole('admin'), async (req, res) => {
  try {
    const schedules = await DoctorSchedule.findAll({
      include: {
        model: Doctor,
        as: 'doctor',
        include: { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      }
    });
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching schedules" });
  }
});


module.exports = router;