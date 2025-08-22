const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DoctorSchedule = sequelize.define('DoctorSchedule', {
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Doctors',
      key: 'id'
    }
  },
  dayOfWeek: {
    type: DataTypes.INTEGER, // 0 = Sunday, 1 = Monday, ...
    allowNull: false,
    validate: {
      min: 0,
      max: 6
    }
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  breaks: {
  type: DataTypes.JSON, // [{ start: "12:00:00", end: "13:00:00" }, ...]
  allowNull: true,
  defaultValue: []
}

}, {
  timestamps: false
});

module.exports = DoctorSchedule;

