import api from "./axios";

// 📌 Get all jobs (optionally filtered by status)
export const getJobs = async (status = "") => {
  try {
    const res = await api.get("/jobs", {
      params: status ? { status } : {}
    });
    return res.data;
  } catch (err) {
    console.error("Failed to fetch jobs:", err);
    throw err;
  }
};

// 📌 Create new job (admin only)
export const createJob = async (data) => {
  try {
    const res = await api.post("/jobs", data);
    return res.data;
  } catch (err) {
    console.error("Failed to create job:", err);
    throw err;
  }
};

// 📌 Update job (admin only)
export const updateJob = async (id, data) => {
  try {
    const res = await api.put(`/jobs/${id}`, data);
    return res.data;
  } catch (err) {
    console.error(`Failed to update job ${id}:`, err);
    throw err;
  }
};

// 📌 Delete job (admin only)
export const deleteJob = async (id) => {
  try {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to delete job ${id}:`, err);
    throw err;
  }
};
