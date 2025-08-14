const { DoctorSchedule, Holiday } = require('../models');

// إضافة جدول عمل لطبيب
exports.createSchedule = async (req, res) => {
  try {
    const { doctorId, dayOfWeek, startTime, endTime } = req.body;
    const schedule = await DoctorSchedule.create({ doctorId, dayOfWeek, startTime, endTime });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// جلب جدول طبيب معيّن
exports.getSchedules = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const schedules = await DoctorSchedule.findAll({ where: { doctorId } });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// حذف جدول طبيب ليوم معيّن (اختياري)
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await DoctorSchedule.destroy({ where: { id } });
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// إضافة يوم عطلة
exports.createHoliday = async (req, res) => {
  try {
    const { date, reason } = req.body;
    const holiday = await Holiday.create({ date, reason });
    res.json(holiday);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// جلب جميع العطل
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.findAll();
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.checkTodayHoliday = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
    const holiday = await Holiday.findOne({ where: { date: today } });

    if (holiday) {
      res.json({ isHoliday: true, reason: holiday.reason });
    } else {
      res.json({ isHoliday: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
