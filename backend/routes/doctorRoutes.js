const express = require('express');
const { getDoctors, addDoctor } = require('../controllers/doctorController');
const router = express.Router();

router.get('/', getDoctors);
router.post('/', addDoctor);

module.exports = router;
