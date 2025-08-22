const { Evaluation, Appointment, Doctor, User } = require('../models');

// -------------------- Create Evaluation -------------------- //
exports.createEvaluation = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const patientId = req.user.id;

    // Check if appointment exists and belongs to this patient
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    if (appointment.patientId !== patientId) return res.status(403).json({ error: 'Not authorized to evaluate this appointment' });

    // Check if evaluation already exists for this appointment
    const existingEvaluation = await Evaluation.findOne({ where: { appointmentId } });
    if (existingEvaluation) return res.status(400).json({ error: 'Evaluation already exists for this appointment' });

    const evaluation = await Evaluation.create({
      appointmentId,
      patientId,
      doctorId: appointment.doctorId,
      rating,
      comment
    });

    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Evaluations for Current User -------------------- //
exports.getMyEvaluations = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'patient') {
      whereClause = { patientId: req.user.id };
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ where: { userId: req.user.id } });
      if (!doctor) return res.status(404).json({ error: 'Doctor profile not found' });
      whereClause = { doctorId: doctor.id };
    }

    const evaluations = await Evaluation.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'patient', attributes: ['name'] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: Appointment, as: 'appointment', attributes: ['date'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- Get Evaluations for a Specific Doctor -------------------- //
exports.getDoctorEvaluations = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const evaluations = await Evaluation.findAll({
      where: { doctorId },
      include: [
        { model: User, as: 'patient', attributes: ['name'] },
        { model: Appointment, as: 'appointment', attributes: ['date'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Get All Evaluations (Admin Only) -------------------- //
exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.findAll({
      include: [
        { model: User, as: 'patient', attributes: ['name'] },
        { model: Doctor, as: 'doctor', include: [{ model: User, as: 'user', attributes: ['name'] }] },
        { model: Appointment, as: 'appointment', attributes: ['date'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(evaluations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
