const { Doctor, User } = require('../models');

exports.getDoctors = async (req, res) => {
  const doctors = await Doctor.findAll({ include: [{ model: User, attributes: ['name', 'email'] }] });
  res.json(doctors);
};

exports.addDoctor = async (req, res) => {
  const { userId, specialty, bio, experience_years } = req.body;
  const doctor = await Doctor.create({ userId, specialty, bio, experience_years });
  res.json(doctor);
};
