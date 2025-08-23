const { Doctor, User } = require('../models');

// -------------------- Get all doctors -------------------- //
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        {
          model: User,
          as: 'user',  // يجب مطابقته مع الـ alias في association
          attributes: ['name', 'email'] // الحقول المطلوبة
        }
      ]
    });
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// -------------------- Get one doctor by ID -------------------- //
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ]
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

// -------------------- Add new doctor (admin only) -------------------- //
const addDoctor = async (req, res) => {
  try {
    const { userId, specialty, bio, experience_years, phone } = req.body;

    if (!userId || !specialty || experience_years == null) {
      return res.status(400).json({ error: 'userId, specialty, and experience_years are required' });
    }

    const newDoctor = await Doctor.create({ userId, specialty, bio, experience_years, phone });
    res.status(201).json(newDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add doctor' });
  }
};

module.exports = { getDoctors, getDoctor, addDoctor };
