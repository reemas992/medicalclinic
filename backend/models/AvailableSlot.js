const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./Doctor');

const AvailableSlot = sequelize.define('AvailableSlot', {
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Doctors', key: 'id' }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  isBooked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

AvailableSlot.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Doctor.hasMany(AvailableSlot, { foreignKey: 'doctorId', as: 'availableSlots' });

module.exports = AvailableSlot;
