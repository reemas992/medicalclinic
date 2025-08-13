
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middelware/auth');

// حماية كل الراوتر للتأكد من أن المستخدم أدمن
router.use(auth, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
});

router.get('/users', adminController.getUsers);
router.get('/doctors', adminController.getDoctors);
router.delete('/user/:id', adminController.deleteUser);
router.put('/doctor/:id', adminController.updateDoctor);
router.get('/appointments', adminController.getAppointments);
router.put('/appointment/:id/status', adminController.updateAppointmentStatus);

module.exports = router;
