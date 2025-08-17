// models/Appointment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  doctorId: { type: DataTypes.INTEGER, allowNull: false },
  patientId: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false }, // yyyy-mm-dd
  startTime: { type: DataTypes.TIME, allowNull: false }, // HH:mm
  endTime: { type: DataTypes.TIME, allowNull: false },   // HH:mm
  status: {
    type: DataTypes.ENUM('scheduled', 'cancelled', 'completed'),
    defaultValue: 'scheduled'
  }
}, { timestamps: true });

module.exports = Appointment;
