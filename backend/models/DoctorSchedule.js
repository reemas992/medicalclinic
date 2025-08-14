const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DoctorSchedule = sequelize.define('DoctorSchedule', {
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  dayOfWeek: {
    type: DataTypes.INTEGER, // 0 = Sunday, 1 = Monday, ...
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  }
}, {
  timestamps: false
});

module.exports = DoctorSchedule;
