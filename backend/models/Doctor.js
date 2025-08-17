// models/Doctor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctor = sequelize.define('Doctor', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  specialty: { type: DataTypes.STRING, allowNull: false },      
  bio: { type: DataTypes.TEXT, allowNull: true },
  experienceYears: { type: DataTypes.INTEGER, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });

module.exports = Doctor;
