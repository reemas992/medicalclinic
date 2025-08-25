const { AvailableSlot, Appointment, Doctor, User } = require('../models');

// جلب الـ slots المتاحة
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ error: 'DoctorId and date are required' });
    }

    const slots = await AvailableSlot.findAll({
      where: { doctorId, date, isBooked: false },
      order: [['startTime', 'ASC']],
      include: [
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['name'] }] }
      ]
    });

    res.json(slots);
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
};

// حجز slot
exports.bookSlot = async (req, res) => {
  try {
    const { slotId } = req.body;
    const patientId = req.user.id;

    const slot = await AvailableSlot.findByPk(slotId);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ error: 'Slot already booked' });

    // إنشاء appointment
    const appointment = await Appointment.create({
      doctorId: slot.doctorId,
      patientId,
      date: new Date(`${slot.date}T${slot.startTime}`),
      status: 'scheduled'
    });

    // تحديث slot
    slot.isBooked = true;
    await slot.save();

    const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: User, as: 'patient', attributes: ['name', 'email'] }
      ]
    });

    res.json({ message: 'Appointment booked successfully', appointment: appointmentWithDetails });
  } catch (err) {
    console.error("Error booking slot:", err);
    res.status(500).json({ error: 'Failed to book slot' });
  }
};
