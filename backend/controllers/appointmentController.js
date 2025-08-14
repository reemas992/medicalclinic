const { Appointment, Doctor, DoctorSchedule, Holiday, User } = require('../models');
const moment = require('moment');

// إنشاء موعد جديد
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    if (!doctorId || !date) {
      return res.status(400).json({ error: 'doctorId and date are required' });
    }

    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay(); // 0 = Sunday, 1 = Monday, ...

    // 1. تحقق إذا كان اليوم عطلة
    const holiday = await Holiday.findOne({
      where: { date: moment(appointmentDate).format('YYYY-MM-DD') },
    });

    if (holiday) {
      return res.status(400).json({
        error: `Clinic is closed on ${holiday.date} (${holiday.reason || 'Holiday'})`,
      });
    }

    // 2. تحقق من توفر الطبيب في هذا اليوم
    const schedule = await DoctorSchedule.findOne({
      where: {
        doctorId,
        dayOfWeek,
      },
    });

    if (!schedule) {
      return res.status(400).json({ error: 'Doctor is not available on this day' });
    }

    // (اختياري: تحقق من توقيت الحجز بالنسبة لجدول الوقت)

    // 3. إنشاء الموعد
    const appointment = await Appointment.create({
      doctorId,
      patientId: req.user.id,
      date: appointmentDate,
      status: 'scheduled',
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// عرض كل المواعيد (للمدير فقط)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Doctor,
          include: [{ model: User, attributes: ['name'] }],
        },
      ],
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// عرض مواعيد المستخدم الحالي (مريض)
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.user.id },
      include: [
        {
          model: Doctor,
          include: [{ model: User, attributes: ['name', 'email'] }],
        },
      ],
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// إلغاء الموعد (مريض أو مدير)
exports.cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);

    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    // تحقق من صلاحية المستخدم
    if (req.user.role !== 'admin' && req.user.id !== appt.patientId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    appt.status = 'cancelled';
    await appt.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// تحديث حالة الموعد (مدير فقط)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);

    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    const { status } = req.body;

    appt.status = status;
    await appt.save();

    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
