const { User, Doctor, Appointment } = require('../models');

// عرض جميع المستخدمين
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// عرض جميع الأطباء مع بياناتهم التفصيلية
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: { model: User, attributes: ['name', 'email'] }
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// حذف مستخدم (مريض أو طبيب)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تحديث بيانات طبيب
exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { specialty, bio, experience_years } = req.body;
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    doctor.specialty = specialty || doctor.specialty;
    doctor.bio = bio || doctor.bio;
    doctor.experience_years = experience_years || doctor.experience_years;
    await doctor.save();

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// عرض كل المواعيد مع إمكانية فلترة حسب الطبيب أو الحالة
exports.getAppointments = async (req, res) => {
  try {
    const { doctorId, status } = req.query;
    const filter = {};
    if (doctorId) filter.doctorId = doctorId;
    if (status) filter.status = status;

    const appointments = await Appointment.findAll({
      where: filter,
      include: [
        { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
        { model: Doctor, include: [{ model: User, attributes: ['name'] }] }
      ]
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// تحديث حالة موعد (مثلا من scheduled إلى cancelled أو completed)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const apptId = req.params.id;
    const { status } = req.body;
    const appt = await Appointment.findByPk(apptId);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    appt.status = status;
    await appt.save();
    res.json(appt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
