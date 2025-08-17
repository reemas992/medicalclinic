// models/index.js
const sequelize = require('../config/db');
const User = require('./User');
const Doctor = require('./Doctor');
const Appointment = require('./Appointment');
const DoctorSchedule = require('./DoctorSchedule');
const Holiday = require('./Holiday');

Doctor.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasOne(Doctor, { foreignKey: 'userId' });

Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'appointments' });

Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });

DoctorSchedule.belongsTo(Doctor, { foreignKey: 'doctorId' });
Doctor.hasMany(DoctorSchedule, { foreignKey: 'doctorId' });

module.exports = { sequelize, Holiday, DoctorSchedule, User, Doctor, Appointment };
