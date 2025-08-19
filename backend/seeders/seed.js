const { sequelize, User, Doctor, Appointment, DoctorSchedule, Holiday } = require('../models');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker'); // Install with: npm install @faker-js/faker

async function seed() {
  try {
    console.log('🌱 Starting seeding...');

    // Wipe existing data
    await sequelize.sync({ force: true });
    console.log('✅ Database synced!');

    // 1️⃣ Create Admins
    const admins = [];
    for (let i = 1; i <= 3; i++) {
      const password = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
        name: `Admin ${i}`,
        email: `admin${i}@clinic.com`,
        password,
        role: 'admin'
      });
      admins.push(admin);
    }

    // 2️⃣ Create Doctors
    const specialties = ['Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedics'];
    const doctors = [];

    for (let i = 0; i < 5; i++) {
      const password = await bcrypt.hash('doctor123', 10);
      const user = await User.create({
        name: `Dr. ${faker.person.firstName()}`,
        email: `doctor${i + 1}@clinic.com`,
        password,
        role: 'doctor'
      });

      const doctor = await Doctor.create({
        userId: user.id,
        specialty: specialties[i],
        bio: faker.lorem.sentence(),
        experienceYears: faker.number.int({ min: 5, max: 20 }),
        phone: faker.phone.number()
      });

      doctors.push(doctor);
    }

    // 3️⃣ Create Patients
    const patients = [];
    for (let i = 1; i <= 50; i++) {
      const password = await bcrypt.hash('patient123', 10);
      const patient = await User.create({
        name: faker.person.fullName(),
        email: `patient${i}@clinic.com`,
        password,
        role: 'patient'
      });
      patients.push(patient);
    }

    // 4️⃣ Doctor Schedules (weekly availability)
    const schedules = [];
    for (const doctor of doctors) {
      // Each doctor works 3 days a week
      const availableDays = faker.helpers.arrayElements([1, 2, 3, 4, 5, 6], 3); // Mon-Sat
      for (const day of availableDays) {
        const start = faker.helpers.arrayElement(['08:00', '09:00', '10:00']);
        const end = faker.helpers.arrayElement(['15:00', '16:00', '17:00']);
        const schedule = await DoctorSchedule.create({
          doctorId: doctor.id,
          dayOfWeek: day,
          startTime: start,
          endTime: end
        });
        schedules.push(schedule);
      }
    }

    // 5️⃣ Appointments
    const appointments = [];
    for (let i = 0; i < 30; i++) {
      const doctor = faker.helpers.arrayElement(doctors);
      const patient = faker.helpers.arrayElement(patients);
      const date = faker.date.between({ from: '2025-08-20', to: '2025-09-20' });
      const startHour = faker.number.int({ min: 9, max: 16 });
      const startTime = `${startHour.toString().padStart(2, '0')}:00`;
      const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;

      const appt = await Appointment.create({
        doctorId: doctor.id,
        patientId: patient.id,
        date: date.toISOString().split('T')[0],
        startTime,
        endTime,
        status: faker.helpers.arrayElement(['scheduled', 'completed'])
      });

      appointments.push(appt);
    }

    // 6️⃣ Holidays
    const holidaysData = [
      { date: '2025-01-01', reason: 'New Year' },
      { date: '2025-03-21', reason: 'Spring Festival' },
      { date: '2025-05-01', reason: 'Labour Day' },
      { date: '2025-06-15', reason: 'Clinic Anniversary' },
      { date: '2025-07-20', reason: 'Summer Break' },
      { date: '2025-08-31', reason: 'Independence Day' },
      { date: '2025-12-25', reason: 'Christmas' },
      { date: '2025-12-31', reason: 'New Year Eve' }
    ];
    await Holiday.bulkCreate(holidaysData);

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
