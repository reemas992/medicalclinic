const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

// Protect all routes with admin role
router.use(auth, requireRole('admin'));

router.get('/users', adminController.getUsers);
router.get('/doctors', adminController.getDoctors);
router.delete('/user/:id', adminController.deleteUser);
router.put('/doctor/:id', adminController.updateDoctor);
router.get('/appointments', adminController.getAppointments);
router.put('/appointment/:id/status', adminController.updateAppointmentStatus);

module.exports = router;