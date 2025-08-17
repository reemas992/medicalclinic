// controllers/appointmentController.js
const { Appointment, Doctor, DoctorSchedule, Holiday, User } = require('../models');
const moment = require('moment');

// تحويل HH:mm إلى دقائق
const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
// تحويل دقائق إلى HH:mm
const fromMinutes = (mins) => {
  const h = String(Math.floor(mins / 60)).padStart(2, '0');
  const m = String(mins % 60).padStart(2, '0');
  return `${h}:${m}`;
};

exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, startTime, durationMinutes = 30 } = req.body;

    if (!doctorId || !date || !startTime) {
      return res.status(400).json({ error: 'doctorId, date, startTime are required' });
    }

    // 0) تحقّق أن المريض موجود في التوكن
    if (!req.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // 1) تحقق إذا كان اليوم عطلة
    const holiday = await Holiday.findOne({
      where: { date: moment(date).format('YYYY-MM-DD') },
    });
    if (holiday) {
      return res.status(400).json({
        error: `Clinic is closed on ${holiday.date} (${holiday.reason || 'Holiday'})`,
      });
    }

    // 2) تحقق من جدول الطبيب لليوم
    const dayOfWeek = moment(date).day(); // 0 الأحد ... 6 السبت (نفس getDay)
    const schedule = await DoctorSchedule.findOne({
      where: { doctorId, dayOfWeek },
    });
    if (!schedule) {
      return res.status(400).json({ error: 'Doctor is not available on this day' });
    }

    // 3) تأكد أن الوقت داخل نافذة العمل
    const reqStartMin = toMinutes(startTime);
    const reqEndMin = reqStartMin + Number(durationMinutes);
    const schStartMin = toMinutes(schedule.startTime);
    const schEndMin = toMinutes(schedule.endTime);

    if (reqStartMin < schStartMin || reqEndMin > schEndMin) {
      return res.status(400).json({ error: 'Appointment time is outside doctor working hours' });
    }

    // 4) منع التعارض: لا يوجد موعد آخر يتداخل مع الفترة المطلوبة
    const requestedEndTime = fromMinutes(reqEndMin);
    const overlaps = await Appointment.findOne({
      where: {
        doctorId,
        date,
        status: ['scheduled', 'completed'], // استثنِ الملغاة
      }
    });

    if (overlaps) {
      // بدلاً من طلب واحد، نجلب جميع مواعيد اليوم ونفحص التداخل بدقة:
      const sameDay = await Appointment.findAll({
        where: { doctorId, date, status: ['scheduled', 'completed'] },
        attributes: ['startTime', 'endTime']
      });

      const conflict = sameDay.some(a => {
        const exStart = toMinutes(a.startTime);
        const exEnd = toMinutes(a.endTime);
        return (reqStartMin < exEnd) && (reqEndMin > exStart); // تداخل
      });

      if (conflict) {
        return res.status(409).json({ error: 'Time slot overlaps with another appointment' });
      }
    }

    // 5) إنشاء الموعد
    const appointment = await Appointment.create({
      doctorId,
      patientId: req.user.id,
      date: moment(date).format('YYYY-MM-DD'),
      startTime,
      endTime: requestedEndTime,
      status: 'scheduled',
    });

    return res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const { doctorId, status } = req.query;
    const where = {};
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
        { model: Doctor, attributes: ['id', 'specialty', 'experienceYears'] }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });
    return res.json(appointments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.user.id },
      include: [
        { model: Doctor, attributes: ['id', 'specialty', 'experienceYears'] }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });
    return res.json(appointments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    if (req.user.role !== 'admin' && req.user.id !== appt.patientId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    appt.status = 'cancelled';
    await appt.save();
    return res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    const { status } = req.body;
    if (!['scheduled', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    appt.status = status;
    await appt.save();
    return res.json(appt);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
