const sequelize = require('../config/db');
const User = require('./User');
const Doctor = require('./Doctor');
const Appointment = require('./Appointment');


Doctor.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Doctor, { foreignKey: 'userId' });

Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

User.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });

module.exports = { sequelize, User, Doctor, Appointment };

