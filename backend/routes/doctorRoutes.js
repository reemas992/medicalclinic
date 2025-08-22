const express = require('express');
const { getDoctors, addDoctor, getDoctor } = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

router.get('/', getDoctors); // تم تعديل المسار
router.get('/:id', getDoctor);
router.post('/', auth, requireRole('admin'), addDoctor);

module.exports = router;
