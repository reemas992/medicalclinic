import api from "./axios"; // تأكد أن axios.js موجود في src/api

// 📌 جلب كل العطلات
export const getHolidays = async () => {
  try {
    const res = await api.get("/holidays");
    return res.data;
  } catch (err) {
    console.error("Error fetching holidays:", err);
    throw err;
  }
};

// 📌 إضافة عطلة جديدة (admin)
export const addHoliday = async (holidayData) => {
  try {
    const res = await api.post("/holiday", holidayData);
    return res.data;
  } catch (err) {
    console.error("Error adding holiday:", err);
    throw err;
  }
};

// 📌 تعديل عطلة موجودة (admin)
export const updateHoliday = async (id, holidayData) => {
  try {
    const res = await api.put(`/holiday/${id}`, holidayData);
    return res.data;
  } catch (err) {
    console.error(`Error updating holiday ${id}:`, err);
    throw err;
  }
};

// 📌 حذف عطلة (admin)
export const deleteHoliday = async (id) => {
  try {
    const res = await api.delete(`/holiday/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error deleting holiday ${id}:`, err);
    throw err;
  }
};
