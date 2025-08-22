const { Doctor } = require('../models'); // تأكد أن نموذج Doctor موجود

// جلب كل الأطباء
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// جلب طبيب واحد حسب الـ ID
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctor' });
  }
};

// إضافة طبيب جديد (يتطلب دور admin)
const addDoctor = async (req, res) => {
  try {
    const { name, specialty, email,experience_years } = req.body;

    if (!name || !specialty || !email || !experience_years) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newDoctor = await Doctor.create({ name, specialty, email,experience_years });
    res.status(201).json(newDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add doctor' });
  }
};

module.exports = { getDoctors, getDoctor, addDoctor };
