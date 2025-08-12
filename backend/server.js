const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');



const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/appointments', appointmentRoutes);

app.get("/", (req, res) => res.send("API is running"));

sequelize.sync({ force: false })
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Error:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on http://localhost: ${PORT}`));

