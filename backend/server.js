const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// نستخدم فقط مسارات تبدأ بـ /api/ لمنع التكرار ولتنظيم أفضل
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/schedule", scheduleRoutes);

app.get("/", (req, res) => res.send("API is running"));

sequelize.sync({ force: false })
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
