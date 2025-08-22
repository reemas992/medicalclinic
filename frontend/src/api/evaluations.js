// frontend/src/api/evaluations.js
import api from "./axios";

// 📌 Create a new evaluation
export const createEvaluation = async (data) => {
  try {
    const res = await api.post("/evaluations", data);
    return res.data;
  } catch (err) {
    console.error("Failed to create evaluation:", err);
    throw err;
  }
};

// 📌 Get evaluations for the current user (patient or doctor)
export const getMyEvaluations = async () => {
  try {
    const res = await api.get("/evaluations/my");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch my evaluations:", err);
    throw err;
  }
};

// 📌 Get all evaluations (admin only)
export const getAllEvaluations = async () => {
  try {
    const res = await api.get("/evaluations");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch all evaluations:", err);
    throw err;
  }
};
