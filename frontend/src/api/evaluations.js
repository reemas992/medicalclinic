import axios from "./axios";

// 🟢 إضافة تقييم جديد
export const addEvaluation = async (data) => {
  return await axios.post("/evaluations", data);
};

// 🟢 جلب كل التقييمات
export const getAllEvaluations = async () => {
  return await axios.get("/evaluations");
};

// 🟢 جلب تقييماتي
export const getMyEvaluations = async () => {
  return await axios.get("/evaluations/me");
};

// 🟢 تعديل تقييم
export const updateEvaluation = async (id, data) => {
  return await axios.put(`/evaluations/${id}`, data);
};

// 🟢 حذف تقييم
export const deleteEvaluation = async (id) => {
  return await axios.delete(`/evaluations/${id}`);
};
