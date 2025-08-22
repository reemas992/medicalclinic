const express = require('express');
const { checkTodayHoliday } = require('../controllers/scheduleController');
const router = express.Router();

router.get('/today', checkTodayHoliday);

module.exports = router;