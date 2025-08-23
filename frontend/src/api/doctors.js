// src/api/doctor.js
import api from "./axios"; // تأكد من أن ملف axios.js موجود في src/api

// 📌 جلب كل الأطباء
export const getDoctors = async () => {
  try {
    const res = await api.get("/doctors");
    console.log(res.data)
    return res.data;
  } catch (err) {
    console.error("Error fetching doctors:", err);
    throw err;
  }
};

// 📌 جلب طبيب معين حسب الـ ID
export const getDoctor = async (id) => {
  try {
    const res = await api.get(`/doctors/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching doctor ${id}:`, err);
    throw err;
  }
};

// 📌 إضافة طبيب جديد (admin فقط)
export const addDoctor = async (doctorData) => {
  try {
    const res = await api.post("/doctors", doctorData);
    return res.data;
  } catch (err) {
    console.error("Error adding doctor:", err);
    throw err;
  }
};

// 📌 تحديث طبيب حسب الـ ID (admin فقط)
export const updateDoctor = async (id, doctorData) => {
  try {
    const res = await api.put(`/doctors/${id}`, doctorData);
    return res.data;
  } catch (err) {
    console.error(`Error updating doctor ${id}:`, err);
    throw err;
  }
};
export const deleteDoctor = async (id) => {
  try {
    const res = await api.delete(`/doctors/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting doctor ${id}:`, err);
    throw err;
  }
};


