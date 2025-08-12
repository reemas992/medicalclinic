const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Appointment = sequelize.define("Appointment", {
  date: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
    defaultValue: "pending"
  }
}, { timestamps: true });

module.exports = Appointment;


