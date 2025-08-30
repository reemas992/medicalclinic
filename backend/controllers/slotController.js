// controllers/slotController.js
const { DoctorSchedule, Appointment } = require('../models');
const moment = require('moment');
const { Op } = require('sequelize');

exports.getAvailableSlots = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId);
    const date = req.query.date; // يجب أن يكون 'YYYY-MM-DD'

    if (!doctorId || !date) return res.status(400).json({ error: "Doctor ID and date are required" });

    const dayOfWeek = moment(date).day();

    // جلب جدول الطبيب لليوم المحدد
    const schedule = await DoctorSchedule.findOne({
      where: { doctorId, dayOfWeek }
    });

    if (!schedule) {
      return res.json({ slots: [] }); // لا يوجد جدول
    }

    // جلب المواعيد المحجوزة في هذا اليوم
    const appointments = await Appointment.findAll({
      where: {
        doctorId,
        date: {
          [Op.gte]: moment(date).startOf('day').toDate(),
          [Op.lt]: moment(date).endOf('day').toDate()
        },
        status: { [Op.notIn]: ['cancelled', 'no_show'] }
      }
    });

    const bookedTimes = appointments.map(a => moment(a.date).format('HH:mm'));

    // توليد slots كل ساعة
    let slots = [];
    let current = moment(schedule.startTime, 'HH:mm:ss');
    const end = moment(schedule.endTime, 'HH:mm:ss');

    while (current.isBefore(end)) {
      const slotTime = current.format('HH:mm');

      // التحقق من البريك
      const inBreak = schedule.breaks?.some(b => {
        const bStart = moment(b.start, 'HH:mm:ss');
        const bEnd = moment(b.end, 'HH:mm:ss');
        return current.isBetween(bStart, bEnd, null, '[)');
      });

      if (!inBreak) {
        slots.push({
          start: slotTime,
          isBooked: bookedTimes.includes(slotTime)
        });
      }

      current.add(1, 'hours');
    }

    res.json({ slots });

  } catch (err) {
    console.error('Error fetching available slots:', err);
    res.status(500).json({ error: err.message });
  }
};
