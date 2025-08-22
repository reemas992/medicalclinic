const { User, Doctor, Appointment } = require('../models');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'phone', 'address', 'createdAt']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all doctors with their details
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: {
        model: User,
        attributes: ['name', 'email', 'phone']
      }
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.destroy({ where: { id: userId } });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update doctor data
exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { specialty, bio, experience_years, phone } = req.body;
    const doctor = await Doctor.findByPk(doctorId);
    
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    doctor.specialty = specialty || doctor.specialty;
    doctor.bio = bio || doctor.bio;
    doctor.experience_years = experience_years || doctor.experience_years;
    doctor.phone = phone || doctor.phone;
    
    await doctor.save();
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all appointments with filtering options
exports.getAppointments = async (req, res) => {
  try {
    const { doctorId, status, date } = req.query;
    const filter = {};
    
    if (doctorId) filter.doctorId = doctorId;
    if (status) filter.status = status;
    if (date) filter.date = { [Op.between]: [new Date(date), new Date(date + 'T23:59:59')] };

    const appointments = await Appointment.findAll({
      where: filter,
      include: [
        {
          model: User,
          as: 'patient',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Doctor,
          include: [{ model: User, attributes: ['name'] }]
        }
      ],
      order: [['date', 'DESC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update appointment status
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
