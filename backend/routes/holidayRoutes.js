// backend/routes/holidayRoutes.js
const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/HolidayController');


router.get('/holidays', holidayController.getHolidays);
router.post('/holiday', holidayController.createHoliday);
router.put('/holiday/:id', holidayController.updateHoliday);
router.delete('/holiday/:id', holidayController.deleteHoliday);

module.exports = router;
