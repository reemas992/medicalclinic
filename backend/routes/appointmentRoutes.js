const express = require('express');
const {
  bookAppointment,
  cancelAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

const auth = require('../middelware/auth');

const router = express.Router();

// 🧾 حجز موعد (مريض)
router.post('/', auth, bookAppointment);

// ❌ إلغاء موعد (مريض أو أدمن)
router.put('/:id/cancel', auth, cancelAppointment);

// 👤 عرض مواعيدي (مريض فقط)
router.get('/my', auth, getMyAppointments);

// 🛠️ عرض كل المواعيد (أدمن فقط) - تحتاج حماية بصلاحية role
router.get('/', auth, getAllAppointments);

// 🔄 تحديث حالة موعد (أدمن فقط)
router.put('/:id/status', auth, updateAppointmentStatus);

module.exports = router;

