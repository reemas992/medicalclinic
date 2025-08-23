// seeders/seed.js
const { sequelize, User, Doctor, Appointment, DoctorSchedule, Holiday, Job } = require('../models');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

async function seed() {
  try {
    console.log('🌱 Starting seeding...');

    // Reset database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced!');

    // 1️⃣ Admins
    const admins = [];
    for (let i = 1; i <= 3; i++) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
        name: `Admin ${i}`,
        email: `admin${i}@clinic.com`,
        password: hashedPassword,
        role: 'admin'
      });
      admins.push(admin);
    }

    // 2️⃣ Doctors
    const specialties = ['Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedics'];
    const doctors = [];

    for (let i = 0; i < 5; i++) {
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      const user = await User.create({
        name: `Dr. ${faker.person.firstName()}`,
        email: `doctor${i + 1}@clinic.com`,
        password: hashedPassword,
        role: 'doctor'
      });

      const doctor = await Doctor.create({
        userId: user.id,
        specialty: specialties[i],
        bio: faker.lorem.sentence(),
        experience_years: faker.number.int({ min: 5, max: 20 }),
        phone: faker.phone.number()
      });

      doctors.push(doctor);
    }

    // 3️⃣ Patients
    const patients = [];
    for (let i = 1; i <= 50; i++) {
      const hashedPassword = await bcrypt.hash('patient123', 10);
      const patient = await User.create({
        name: faker.person.fullName(),
        email: `patient${i}@clinic.com`,
        password: hashedPassword,
        role: 'patient'
      });
      patients.push(patient);
    }

    // 4️⃣ Doctor Schedules
    for (const doctor of doctors) {
      const availableDays = faker.helpers.arrayElements([1, 2, 3, 4, 5, 6], 3);
      for (const day of availableDays) {
        await DoctorSchedule.create({
          doctorId: doctor.id,
          dayOfWeek: day,
          startTime: faker.helpers.arrayElement(['08:00:00', '09:00:00', '10:00:00']),
          endTime: faker.helpers.arrayElement(['15:00:00', '16:00:00', '17:00:00']),
          breaks: [{ start: "12:00:00", end: "13:00:00" }]
        });
      }
    }

    // 5️⃣ Appointments
    for (let i = 0; i < 30; i++) {
      const doctor = faker.helpers.arrayElement(doctors);
      const patient = faker.helpers.arrayElement(patients);
      const date = faker.date.between({ from: '2025-08-20', to: '2025-09-20' });

      await Appointment.create({
        doctorId: doctor.id,
        patientId: patient.id,
        date: date,
        status: faker.helpers.arrayElement(['scheduled', 'completed', 'cancelled', 'no_show']),
        notes: faker.lorem.sentence()
      });
    }

    // 6️⃣ Holidays
    await Holiday.bulkCreate([
      { date: '2025-01-01', reason: 'New Year' },
      { date: '2025-03-21', reason: 'Spring Festival' },
      { date: '2025-05-01', reason: 'Labour Day' },
      { date: '2025-06-15', reason: 'Clinic Anniversary' },
      { date: '2025-07-20', reason: 'Summer Break' },
      { date: '2025-08-31', reason: 'Independence Day' },
      { date: '2025-12-25', reason: 'Christmas' },
      { date: '2025-12-31', reason: 'New Year Eve' }
    ]);

    // 7️⃣ Jobs
    await Job.bulkCreate([
      { title: "Nurse", department: "General", description: "Provide patient care and assist doctors.", requirements: "Nursing degree, 2+ years experience", status: "open" },
      { title: "Receptionist", department: "Front Desk", description: "Manage appointments and greet patients.", requirements: "Good communication, computer skills", status: "open" },
      { title: "Lab Technician", department: "Laboratory", description: "Handle lab tests and maintain equipment.", requirements: "Lab certification, 1+ year experience", status: "open" },
      { title: "Pharmacist", department: "Pharmacy", description: "Dispense medications and advise patients.", requirements: "Pharmacy degree, 2+ years experience", status: "open" },
      { title: "IT Support", department: "IT", description: "Maintain clinic systems and provide tech support.", requirements: "Knowledge of networks & troubleshooting", status: "open" }
    ]);

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
