const { Appointment, Doctor, DoctorSchedule, Holiday, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

// Create new appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, notes } = req.body;
    
    if (!doctorId || !date) {
      return res.status(400).json({ error: 'Doctor ID and date are required' });
    }

    const patientId = req.user.id;
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay(); // 0 = Sunday, 1 = Monday, ...
    const dateOnly = moment(appointmentDate).format('YYYY-MM-DD');

    // 1. Check if it's a holiday
    const holiday = await Holiday.findOne({
      where: { date: dateOnly }
    });

    if (holiday) {
      return res.status(400).json({ 
        error: `Clinic is closed on ${holiday.date} due to: ${holiday.reason || 'Holiday'}` 
      });
    }

    // 2. Check doctor availability for this day
    const schedule = await DoctorSchedule.findOne({
      where: { 
        doctorId, 
        dayOfWeek 
      }
    });

    if (!schedule) {
      return res.status(400).json({ error: 'Doctor is not available on this day' });
    }

    // 3. Check if appointment time is within doctor's working hours
    const appointmentTime = moment(appointmentDate);
    const startTime = moment(schedule.startTime, 'HH:mm:ss');
    const endTime = moment(schedule.endTime, 'HH:mm:ss');
    
    const appointmentTimeOnly = moment(appointmentTime.format('HH:mm:ss'), 'HH:mm:ss');
    
    if (appointmentTimeOnly.isBefore(startTime) || appointmentTimeOnly.isAfter(endTime)) {
      return res.status(400).json({ 
        error: `Appointment time is outside working hours. Working hours: ${schedule.startTime} - ${schedule.endTime}` 
      });
    }
// تحقق من فترات الاستراحة
const isDuringBreak = schedule.breaks.some(b => {
  const breakStart = moment(b.start, 'HH:mm:ss');
  const breakEnd = moment(b.end, 'HH:mm:ss');
  return appointmentTimeOnly.isBetween(breakStart, breakEnd, null, '[)');
});

if (isDuringBreak) {
  return res.status(400).json({ 
    error: `Appointment time falls within a break period. Breaks: ${schedule.breaks.map(b => `${b.start}-${b.end}`).join(', ')}` 
  });
}

    // 4. Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        date: {
          [Op.between]: [
            moment(appointmentDate).subtract(29, 'minutes').toDate(),
            moment(appointmentDate).add(29, 'minutes').toDate()
          ]
        },
        status: {
          [Op.notIn]: ['cancelled', 'no_show']
        }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'There is another appointment at this time' });
    }

    // 5. Create the appointment
    const appointment = await Appointment.create({
      doctorId,
      patientId,
      date: appointmentDate,
      notes: notes || null,
      status: 'scheduled'
    });

    // 6. Get appointment details with related information
    const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{ 
            model: User, 
            as: 'user',
            attributes: ['name', 'email'] 
          }]
        },
        {
          model: User,
          as: 'patient',
          attributes: ['name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: appointmentWithDetails
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ error: 'Error booking appointment' });
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

// Get current user's appointments
exports.getMyAppointments = async (req, res) => {
  try {
    let whereClause = {};
    
    // For patients, get their appointments
    if (req.user.role === 'patient') {
      whereClause = { patientId: req.user.id };
    } 
    // For doctors, get appointments assigned to them
    else if (req.user.role === 'doctor') {
      // First get the doctor record for this user
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      whereClause = { doctorId: doctor.id };
    }
    
    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: Doctor,
          as: 'doctor',
          include: [{ 
            model: User, 
            as: 'user',
            attributes: ['name', 'email'] 
          }]
        },
        {
          model: User,
          as: 'patient',
          attributes: ['name', 'email']
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
