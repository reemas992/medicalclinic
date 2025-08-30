// backend/controllers/HolidayController.js
const Holiday = require('../models/Holiday');

// Get all holidays
exports.getHolidays = async (req, res) => {
    try {
        const holidays = await Holiday.findAll({ order: [['date', 'ASC']] });
        res.json(holidays);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve holidays' });
    }
};

// Create a new holiday
exports.createHoliday = async (req, res) => {
    const { date, reason } = req.body;

    if (!date) {
        return res.status(400).json({ message: 'Date is required' });
    }

    try {
        const existing = await Holiday.findOne({ where: { date } });
        if (existing) {
            return res.status(400).json({ message: 'A holiday is already registered on this date' });
        }

        const newHoliday = await Holiday.create({ date, reason });
        res.status(201).json(newHoliday);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create holiday' });
    }
};
// Update an existing holiday
exports.updateHoliday = async (req, res) => {
    const { id } = req.params;
    const { date, reason } = req.body;

    try {
        const holiday = await Holiday.findByPk(id);
        if (!holiday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }

        await holiday.update({ date, reason });
        res.json(holiday);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update holiday' });
    }
};

// Delete a holiday
exports.deleteHoliday = async (req, res) => {
    const { id } = req.params;

    try {
        const holiday = await Holiday.findByPk(id);
        if (!holiday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }

        await holiday.destroy();
        res.json({ message: 'Holiday deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete holiday' });
    }
};
