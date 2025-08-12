// controllers/appointmentController.js
const { Appointment } = require('../models');

// 🟢 حجز موعد
exports.bookAppointment = async (req, res) => {
  try {
    const { date, doctorId } = req.body;

    const appointment = await Appointment.create({
      date,
      doctorId,
      patientId: req.user.id
    });

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟠 إلغاء موعد
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // التحقق من ملكية الموعد
    if (appointment.patientId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to cancel this appointment' });
    }

    await appointment.destroy();
    res.json({ message: 'Appointment canceled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.user.id }
    });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
