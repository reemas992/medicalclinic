const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const alertRoutes = require('./routes/alertRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const seed = require('./seeders/seed');
const evaluationRoutes = require("./routes/evaluationRoutes");
const listEndpoints = require('express-list-endpoints');
const jobsRoutes = require('./routes/jobRoutes');
const holidayRoutes=require('./routes/holidayRoutes')
const app = express();
app.use(cors());
app.use(express.json());

// نستخدم فقط مسارات تبدأ بـ /api/ لمنع التكرار ولتنظيم أفضل
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/alerts", alertRoutes); 
app.use("/api/schedule", scheduleRoutes);
app.use("/api/evaluations", evaluationRoutes); // ratings
app.use('/api/jobs', jobsRoutes);
app.use('/api', holidayRoutes);
app.get('/', (req, res) => res.send('API is running'));
app.get('/api/doctors/ping', (req, res) => res.send('pong'));
console.log(listEndpoints(app));

sequelize.sync({ force: false })
  .then(async () =>  {
    console.log("calling Seed.js...");

   //await seed();
    console.log("Database Connected ✔️")
  })
  .catch(err => console.error("❌ DB Error:", err));
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
