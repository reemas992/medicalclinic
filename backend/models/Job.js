const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Job = sequelize.define("Job", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    defaultValue: 'open'
  }
}, {
  timestamps: true
});

module.exports = Job;