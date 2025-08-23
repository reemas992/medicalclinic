import api from "./axios"; // تأكد أن axios.js موجود في src/api

// 📌 جلب كل الجداول لجميع الأطباء (admin)
export const getAllSchedules = async () => {
  try {
    const res = await api.get("/doctor-schedule");
    return res.data;
  } catch (err) {
    console.error("Error fetching schedules:", err);
    throw err;
  }
};

// 📌 جلب جدول طبيب محدد
export const getDoctorSchedule = async (doctorId) => {
  try {
    const res = await api.get(`/doctor-schedule/${doctorId}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching schedule for doctor ${doctorId}:`, err);
    throw err;
  }
};

// 📌 إضافة جدول جديد لطبيب
export const addSchedule = async (scheduleData) => {
  try {
    const res = await api.post("/doctor-schedule", scheduleData);
    return res.data;
  } catch (err) {
    console.error("Error adding schedule:", err);
    throw err;
  }
};

// 📌 حذف جدول
export const deleteSchedule = async (id) => {
  try {
    const res = await api.delete(`/doctor-schedule/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting schedule ${id}:`, err);
    throw err;
  }
};

// 📌 تعديل جدول (إذا أردت دعم التعديل لاحقًا)
export const updateSchedule = async (id, scheduleData) => {
  try {
    const res = await api.put(`/doctor-schedule/${id}`, scheduleData);
    return res.data;
  } catch (err) {
    console.error(`Error updating schedule ${id}:`, err);
    throw err;
  }
};
