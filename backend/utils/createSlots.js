const { Doctor } = require('../models');
const AvailableSlot = require('../models/AvailableSlot');
const moment = require('moment');

const createDailySlots = async () => {
  const doctors = await Doctor.findAll();

  const today = moment().startOf('day');

  for (const doctor of doctors) {
    // مثال: من 09:00 إلى 17:00، فترة كل 30 دقيقة
    let startTime = moment('09:00', 'HH:mm');
    const endTime = moment('17:00', 'HH:mm');

    while (startTime.isBefore(endTime)) {
      const existingSlot = await AvailableSlot.findOne({
        where: {
          doctorId: doctor.id,
          date: today.format('YYYY-MM-DD'),
          time: startTime.format('HH:mm:ss')
        }
      });

      if (!existingSlot) {
        await AvailableSlot.create({
          doctorId: doctor.id,
          date: today.format('YYYY-MM-DD'),
          time: startTime.format('HH:mm:ss')
        });
      }

      startTime.add(30, 'minutes');
    }
  }
};

module.exports = createDailySlots;
