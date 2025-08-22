const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Holiday = sequelize.define('Holiday', {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: true
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: false
});

module.exports = Holiday;