const express = require('express');
const { getDoctors, getDoctor, addDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');

const router = express.Router();

router.get('/', getDoctors);
router.get('/:id', getDoctor);
router.post('/', auth, requireRole('admin'), addDoctor);
router.put('/:id', auth, requireRole('admin'), updateDoctor);
router.delete('/:id', auth, requireRole('admin'), deleteDoctor);


module.exports = router;
