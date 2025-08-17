// controllers/doctorController.js
const { Doctor, User } = require('../models');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }]
    });
    return res.json(doctors);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addDoctor = async (req, res) => {
  try {
    const { userId, specialty, bio, experienceYears, phone } = req.body;
    if (!userId || !specialty) {
      return res.status(400).json({ error: 'userId and specialty are required' });
    }
    const doctor = await Doctor.create({ userId, specialty, bio, experienceYears, phone });
    return res.json(doctor);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
