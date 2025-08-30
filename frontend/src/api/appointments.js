import api from './axios';

// 📌 Book appointment
export const bookAppointment = async ({ doctorId, date }) => {
  const res = await api.post("/appointments", { doctorId, date });
  return res.data;
};

// 📌 Cancel appointment
export const cancelAppointment = async (id) => {
  const res = await api.put(`/appointments/${id}/cancel`);
  return res.data;
};

// 📌 Get current patient's appointments
export const getMyAppointments = async () => {
  const res = await api.get("/appointments/my");
  return res.data;
};

// 📌 Get all appointments (admin only)
export const getAllAppointments = async () => {
  const res = await api.get("/appointments");
  return res.data;
};

// 📌 Update appointment status (admin only)
export const updateAppointmentStatus = async (id, status) => {
  const res = await api.put(`/appointments/${id}/status`, { status });
  return res.data;
};

// 📌 Get appointments by patient
export const getAppointmentsByPatient = async (patientId) => {
  const res = await api.get(`/appointments/patient/${patientId}`);
  return res.data;
};
export const getDoctorAppointments = async () => {
  const res = await api.get("/appointments/my-doctor");
  return res.data;
};

export const getAvailableSlots = async (doctorId, date) => {
  try {
    const { data } = await api.get(`/slots/${doctorId}?date=${date}`);
    return data.slots; // [{ start: "09:00", isBooked: false }, ...]
  } catch (err) {
    console.error("Failed to fetch slots", err);
    throw err;
  }
};