const { Doctor, User } = require('../models');

// Get one doctor
const getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (err) { res.status(500).json({ error: 'Failed to fetch doctor' }); }
};


// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

// Add doctor (Admin only)
const addDoctor = async (req, res) => {
  try {
    const { userId, name, specialty, experience_years, image } = req.body;


   

    if (!userId && !name) {
      return res.status(400).json({ error: "Provide either userId or name" });
    }
    if (!specialty || experience_years == null) {
      return res.status(400).json({ error: "Specialty and experience_years are required" });
    }

    let doctorUserId = userId;

    if (!userId) {
      // إنشاء مستخدم جديد باسم الطبيب
      const newUser = await User.create({ name, role: "doctor" });
      doctorUserId = newUser.id;
    }

const newDoctor = await Doctor.create({ userId: doctorUserId, specialty, experience_years, image });
    // جلب الطبيب مع اسم المستخدم
 const doctorWithUser = await Doctor.findByPk(newDoctor.id, {
  include: [{ model: User, as: "user", attributes: ["name"] }],
  attributes: ["id","specialty","experience_years","image"]
});

    res.status(201).json(doctorWithUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add doctor" });
  }
};

// Update doctor
const updateDoctor = async (req, res) => {
  try {
   const { specialty, bio, experience_years, phone, name, image } = req.body;

    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

  await doctor.update({ specialty, bio, experience_years, phone, image });
    if (name) await doctor.user.update({ name });

    const updatedDoctor = await Doctor.findByPk(doctor.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }]
    });

    res.json(updatedDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update doctor' });
  }
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // نحذف الطبيب مباشرة
    const deleted = await Doctor.destroy({ where: { id: doctorId } });

    if (!deleted) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    return res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Doctor Error:", error);
    return res.status(500).json({ error: "Failed to delete doctor" });
  }
};

module.exports = { getDoctors,getDoctor, addDoctor, updateDoctor, deleteDoctor };
