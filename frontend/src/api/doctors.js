// src/api/doctor.js
import api from "./axios"; // 


// 📌 Get all doctors including their schedule
export const getDoctors = async () => {
  const res = await api.get("/doctors");
  return res.data;
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


export const addDoctor = async (doctorData) => {
  const res = await api.post("/doctors", doctorData);
  return res.data;
};

export const updateDoctor = async (id, doctorData) => {
  const res = await api.put(`/doctors/${id}`, doctorData);
  return res.data;
};

export const deleteDoctor = async (id) => {
  const res = await api.delete(`/doctors/${id}`);
  return res.data;
};

