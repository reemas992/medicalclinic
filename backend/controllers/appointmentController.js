const { Appointment, Doctor, DoctorSchedule, Holiday, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');



// ✅ إرجاع مواعيد المريض
exports.getAppointmentsByPatient = async (req, res) => {
  try {
    const { id } = req.params;

    const appointments = await Appointment.findAll({
      where: { patientId: id },
      order: [['date', 'ASC']],
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    res.json(appointments);
  } catch (err) {
    console.error('❌ Error fetching appointments by patient:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.bookAppointment = async (req,res) => {
  try {
    const { doctorId, date } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !date) return res.status(400).json({ error: "Doctor ID and date required" });

    const appointmentDate = moment(date);

    // Check existing appointments for same slot
    const conflict = await Appointment.findOne({
      where: {
        doctorId,
        date: appointmentDate.toDate(),
        status: { [Op.notIn]: ['cancelled','no_show'] }
      }
    });

    if (conflict) return res.status(400).json({ error: "This slot is already booked" });

    const appointment = await Appointment.create({ doctorId, patientId, date: appointmentDate.toDate() });

    const result = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: User, as: 'patient', attributes: ['name'] }
      ]
    });

    res.status(201).json({ message: "Booked successfully", appointment: result });

  } catch(err) { res.status(500).json({ error: err.message }); }
};

// Get current user's appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.user.id },
      include: [{ model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['name'] }] }],
      order: [['date', 'ASC']]
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};
// Get all appointments (admin only)
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Doctor,
          as: 'doctor',
          include: [{ 
            model: User, 
            as: 'user',
            attributes: ['name'] 
          }]
        }
      ],
      order: [['date', 'DESC']]
    });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    // Check user authorization
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

// Update appointment status (admin only)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    const { status } = req.body;
    const validStatuses = ["scheduled", "completed", "cancelled", "no_show"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    appt.status = status;
    await appt.save();

    res.json({ message: "Appointment status updated successfully", appointment: appt });
  } catch (err) {
    console.error("Error updating appointment status:", err);
    res.status(500).json({ error: "Failed to update appointment status" });
  }
};
// GET /appointments/my-doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    // إيجاد الطبيب المرتبط بالمستخدم
    const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const appointments = await Appointment.findAll({
      where: { doctorId: doctor.id },
      include: [
        { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['name'] }] }
      ],
      order: [['date', 'ASC']]
    });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctor appointments' });
  }
};
