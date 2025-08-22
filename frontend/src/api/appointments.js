import api from "./axios";

// 📌 Book appointment (patient)
export const bookAppointment = async (appointmentData) => {
  const res = await api.post("/appointments", appointmentData);
  return res.data;
};

// 📌 Cancel appointment (patient or admin)
export const cancelAppointment = async (id) => {
  const res = await api.put(`/appointments/${id}/cancel`);
  return res.data;
};

// 📌 Get my appointments (patient or doctor)
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
  const res = await api.put(`/appointments/${id}/status`, {status: "completed"});
  return res.data;
};
