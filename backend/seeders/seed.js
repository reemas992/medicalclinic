const { sequelize, User, Doctor, Appointment, DoctorSchedule, Holiday } = require('../models');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

async function seed() {
  try {
    console.log('🌱 Starting seeding...');

    // Reset database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced!');

    // 1️⃣ Admins
    const admins = [];
    for (let i = 1; i <= 3; i++) {
      const admin = await User.create({
        name: `Admin ${i}`,
        email: `admin${i}@clinic.com`,
        password: 'admin123', // hook will hash
        role: 'admin'
      });
      admins.push(admin);
    }

    // 2️⃣ Doctors
    const specialties = ['Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedics'];
    const doctors = [];

    for (let i = 0; i < 5; i++) {
      const user = await User.create({
        name: `Dr. ${faker.person.firstName()}`,
        email: `doctor${i + 1}@clinic.com`,
        password: 'doctor123',
        role: 'doctor'
      });

      const doctor = await Doctor.create({
        userId: user.id,
        specialty: specialties[i],
        bio: faker.lorem.sentence(),
        experience_years: faker.number.int({ min: 5, max: 20 }), // ✅ match model
        phone: faker.phone.number()
      });

      doctors.push(doctor);
    }

    // 3️⃣ Patients
    const patients = [];
    for (let i = 1; i <= 50; i++) {
      const patient = await User.create({
        name: faker.person.fullName(),
        email: `patient${i}@clinic.com`,
        password: 'patient123',
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
          startTime: faker.helpers.arrayElement(['08:00', '09:00', '10:00']),
          endTime: faker.helpers.arrayElement(['15:00', '16:00', '17:00'])
        });
      }
    }

    // 5️⃣ Appointments
    for (let i = 0; i < 30; i++) {
      const doctor = faker.helpers.arrayElement(doctors);
      const patient = faker.helpers.arrayElement(patients);
      const date = faker.date.between({ from: '2025-08-20', to: '2025-09-20' });
      const startHour = faker.number.int({ min: 9, max: 16 });
      const startTime = `${startHour.toString().padStart(2, '0')}:00`;
      const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;

      await Appointment.create({
        doctorId: doctor.id,
        patientId: patient.id,
        date: date.toISOString().split('T')[0],
        status: faker.helpers.arrayElement(['scheduled', 'completed']),
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

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
