// controllers/adminController.js
const { User, Doctor, Appointment } = require('../models');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: { model: User, attributes: ['name', 'email'] }
    });
    return res.json(doctors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { specialty, bio, experienceYears, phone } = req.body;
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    doctor.specialty = specialty ?? doctor.specialty;
    doctor.bio = bio ?? doctor.bio;
    doctor.experienceYears = experienceYears ?? doctor.experienceYears;
    doctor.phone = phone ?? doctor.phone;

    await doctor.save();
    return res.json(doctor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { doctorId, status } = req.query;
    const where = {};
    if (doctorId) where.doctorId = doctorId;
    if (status) where.status = status;

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
        { model: Doctor, include: [{ model: User, attributes: ['name'] }] }
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']]
    });

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const apptId = req.params.id;
    const { status } = req.body;
    if (!['scheduled', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const appt = await Appointment.findByPk(apptId);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    appt.status = status;
    await appt.save();
    return res.json(appt);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
