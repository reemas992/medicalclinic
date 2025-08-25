import axios from "./axios";

// 🟢 Add evaluation
export const addEvaluation = async (data) => {
  return await axios.post("/evaluations", data);
};

// 🟢 Get all evaluations
export const getAllEvaluations = async () => {
  return await axios.get("/evaluations");
};

// 🟢 Update evaluation
export const updateEvaluation = async (id, data) => {
  return await axios.put(`/evaluations/${id}`, data);
};

// 🟢 Delete evaluation
export const deleteEvaluation = async (id) => {
  return await axios.delete(`/evaluations/${id}`);
};
