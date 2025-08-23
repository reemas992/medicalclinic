// backend/controllers/HolidayController.js
const Holiday = require('../models/Holiday');

// Get all holidays
exports.getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.findAll({ order: [['date', 'ASC']] });
        res.json(holidays);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'حدث خطأ أثناء جلب العطلات' });
    }
};

// Create a new holiday
exports.createHoliday = async (req, res) => {
    const { date, reason } = req.body;

    if (!date) {
        return res.status(400).json({ message: 'التاريخ مطلوب' });
    }

    try {
        const existing = await Holiday.findOne({ where: { date } });
        if (existing) {
            return res.status(400).json({ message: 'هناك عطلة مسجلة في هذا التاريخ بالفعل' });
        }

        const newHoliday = await Holiday.create({ date, reason });
        res.status(201).json(newHoliday);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'حدث خطأ أثناء إنشاء العطلة' });
    }
};
