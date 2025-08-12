const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctor = sequelize.define("Doctor", {
  specialization: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: true }
}, { timestamps: true });

module.exports = Doctor;