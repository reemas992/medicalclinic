// backend/routes/holidayRoutes.js
const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/HolidayController');

// GET جميع العطلات
router.get('/holidays', holidayController.getHolidays);

// POST إنشاء عطلة جديدة
router.post('/holiday', holidayController.createHoliday);

module.exports = router;
