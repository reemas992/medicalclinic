// seeders/seed.js
const { sequelize, User, Doctor, Appointment, DoctorSchedule, Holiday, Job, Evaluation } = require('../models');
const { faker } = require('@faker-js/faker');

async function seed() {
  try {
    console.log('🌱 Starting seeding...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced!');

    // 1️⃣ Admin
    await User.findOrCreate({
      where: { email: `admin@clinic.com` },
      defaults: { name: 'Admin', password: 'admin123', role: 'admin' }
    });

    // 2️⃣ Doctors
    const specialties = ['Cardiology', 'Dermatology', 'Pediatrics', 'Neurology', 'Orthopedics', 'General Medicine'];
    const doctorImages = [
      "https://th.bing.com/th/id/OIP.ksWndG2c6RSEBkWA6Uo59wHaIU?w=161&h=182",
      "https://th.bing.com/th/id/OIP.JW_4m4RVV4ywf0aiB6TWrgHaLH?w=142&h=213",
      "https://th.bing.com/th/id/OIP.qNSiJ7PqVb9R24N0D_4bewHaNK?w=120&h=213",
      "https://th.bing.com/th/id/OIP.NxTTkG4A_Uapp2f1T1Qz3gHaKz?w=146&h=213",
      "https://th.bing.com/th/id/OIP.9wHb7nRDp6VuwJPUbABsFAHaLu?w=115&h=180",
      "https://th.bing.com/th?q=Doktor+Bilder&w=120&h=120"
    ];

    const doctors = [];
    for (let i = 0; i < specialties.length; i++) {
      const [user] = await User.findOrCreate({
        where: { email: `doctor${i + 1}@clinic.com` },
        defaults: { name: `Dr. ${faker.person.fullName()}`, password: 'doctor123', role: 'doctor' }
      });

      const [doctor] = await Doctor.findOrCreate({
        where: { userId: user.id },
        defaults: {
          specialty: specialties[i],
          bio: faker.lorem.sentence(),
          experience_years: faker.number.int({ min: 5, max: 20 }),
          phone: faker.phone.number(),
          image: doctorImages[i]
        }
      });

      doctors.push(doctor);
    }

    // 3️⃣ Patients
    const patients = [];
    for (let i = 1; i <= 50; i++) {
      const [patient] = await User.findOrCreate({
        where: { email: `patient${i}@clinic.com` },
        defaults: { name: faker.person.fullName(), password: 'patient123', role: 'patient' }
      });
      patients.push(patient);
    }

    // 4️⃣ Doctor Schedules
    for (const doctor of doctors) {
      const availableDays = faker.helpers.arrayElements([1, 2, 3, 4, 5], 3); // 3 أيام عشوائية
      for (const day of availableDays) {
        await DoctorSchedule.findOrCreate({
          where: { doctorId: doctor.id, dayOfWeek: day },
          defaults: {
            startTime: '08:00:00',
            endTime: '16:00:00',
            breaks: [{ start: "12:00:00", end: "13:00:00" }]
          }
        });
      }
    }

    // 5️⃣ Appointments
    for (let i = 0; i < 50; i++) {
      const doctor = faker.helpers.arrayElement(doctors);
      const patient = faker.helpers.arrayElement(patients);
      const date = faker.date.between({ from: '2025-08-20', to: '2025-09-20' });
      await Appointment.findOrCreate({
        where: { doctorId: doctor.id, patientId: patient.id, date },
        defaults: {
          status: faker.helpers.arrayElement(['scheduled', 'completed', 'cancelled', 'no_show']),
          notes: faker.lorem.sentence()
        }
      });
    }

    // 6️⃣ Holidays (7 holidays)
    const holidaysData = [
      { date: '2025-01-01', reason: 'New Year' },
      { date: '2025-03-21', reason: 'Spring Festival' },
      { date: '2025-05-01', reason: 'Labour Day' },
      { date: '2025-06-15', reason: 'Clinic Anniversary' },
      { date: '2025-07-20', reason: 'Summer Break' },
      { date: '2025-08-31', reason: 'Independence Day' },
      { date: '2025-12-25', reason: 'Christmas' }
    ];
    for (const holiday of holidaysData) {
      await Holiday.findOrCreate({ where: { date: holiday.date }, defaults: { reason: holiday.reason } });
    }

    // 7️⃣ Jobs (7 jobs)
    const jobsData = [
      { title: "Nurse", department: "General", description: "Provide patient care.", requirements: "Nursing degree", status: "open" },
      { title: "Receptionist", department: "Front Desk", description: "Manage appointments.", requirements: "Good communication", status: "open" },
      { title: "Lab Technician", department: "Laboratory", description: "Handle lab tests.", requirements: "Lab certification", status: "open" },
      { title: "Pharmacist", department: "Pharmacy", description: "Dispense medications.", requirements: "Pharmacy degree", status: "open" },
      { title: "IT Support", department: "IT", description: "Maintain systems.", requirements: "Knowledge of networks", status: "open" },
      { title: "Physiotherapist", department: "Rehab", description: "Assist patients.", requirements: "Physiotherapy degree", status: "open" },
      { title: "Dietitian", department: "Nutrition", description: "Plan diets.", requirements: "Nutrition degree", status: "open" }
    ];
    for (const job of jobsData) {
      await Job.findOrCreate({ where: { title: job.title }, defaults: job });
    }

    // 8️⃣ Evaluations (20 evaluations)
    const positiveComments = [
      "Excellent service!", "Staff were very kind.", "Really satisfied!", "Friendly staff.", "Quick and smooth visit!"
    ];
    const neutralComments = ["It was okay.", "Good but waiting time long.", "Average experience."];
    for (let i = 0; i < 20; i++) {
      const patient = faker.helpers.arrayElement(patients);
      const rating = Math.random() > 0.2 ? faker.number.int({ min: 4, max: 5 }) : faker.number.int({ min: 2, max: 3 });
      await Evaluation.findOrCreate({
        where: { userId: patient.id, comment: faker.lorem.sentence() },
        defaults: {
          userId: patient.id,
          rating,
          comment: rating >= 4 ? faker.helpers.arrayElement(positiveComments) : faker.helpers.arrayElement(neutralComments)
        }
      });
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding error:', err);
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;
