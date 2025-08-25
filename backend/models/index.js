const sequelize = require('../config/db');
const User = require('./User');
const Doctor = require('./Doctor');
const Appointment = require('./Appointment');
const DoctorSchedule = require('./DoctorSchedule');
const Holiday = require('./Holiday');
const Evaluation = require('./Evaluation');
const Job = require('./Job');

// Define associations
Doctor.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Doctor, { foreignKey: 'userId', as: 'doctorProfile' });

Appointment.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
User.hasMany(Appointment, { foreignKey: 'patientId', as: 'patientAppointments' });

Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Doctor.hasMany(Appointment, { foreignKey: 'doctorId', as: 'doctorAppointments' });

DoctorSchedule.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });
Doctor.hasMany(DoctorSchedule, { foreignKey: 'doctorId', as: 'schedules' });

// علاقة: كل تقييم ينتمي لمستخدم
Evaluation.belongsTo(User, { foreignKey: 'userId', as: 'evaluator' });
User.hasMany(Evaluation, { foreignKey: 'userId', as: 'evaluations' });



module.exports = {
  sequelize,
  User,
  Doctor,
  Appointment,
  DoctorSchedule,
  Holiday,
  Evaluation,
  Job
};