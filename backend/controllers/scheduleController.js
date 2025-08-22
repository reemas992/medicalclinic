const { DoctorSchedule, Holiday } = require('../models');

// -------------------- Doctor Schedule -------------------- //

// Create doctor schedule
exports.createSchedule = async (req, res) => {
  try {
    const { doctorId, dayOfWeek, startTime, endTime, breaks } = req.body;

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ error: 'Invalid time format. Use HH:mm:ss' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const schedule = await DoctorSchedule.create({
      doctorId,
      dayOfWeek,
      startTime,
      endTime,
      breaks: breaks || []
    });

    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get doctor schedules
exports.getSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const schedules = await DoctorSchedule.findAll({
      where: { doctorId },
      order: [['dayOfWeek', 'ASC']]
    });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete doctor schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await DoctorSchedule.destroy({ where: { id } });
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Holiday -------------------- //

// Create holiday
exports.createHoliday = async (req, res) => {
  try {
    const { date, reason } = req.body;
    const existingHoliday = await Holiday.findOne({ where: { date } });
    if (existingHoliday) return res.status(400).json({ error: 'Holiday already exists for this date' });

    const holiday = await Holiday.create({ date, reason });
    res.status(201).json(holiday);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all holidays
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.findAll({ order: [['date', 'ASC']] });
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if today is a holiday
exports.checkTodayHoliday = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const holiday = await Holiday.findOne({ where: { date: today } });

    if (holiday) {
      return res.json({ todayIsHoliday: true, reason: holiday.reason });
    } else {
      return res.json({ todayIsHoliday: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
