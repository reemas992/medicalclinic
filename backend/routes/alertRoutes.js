// routes/alertRoutes.js
const express = require('express');
const { checkTodayHoliday } = require('../controllers/alertController.js');
const router = express.Router();

router.get('/today', checkTodayHoliday); // مثال: GET /api/alerts/today

module.exports = router;
