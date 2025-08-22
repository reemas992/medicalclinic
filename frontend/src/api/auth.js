// auth.js
import axios from './axios';

// تسجيل مستخدم جديد
export const registerUser = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

// تسجيل الدخول
export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

// جلب بيانات المستخدم الحالي
export const getCurrentUser = async () => {
  const response = await axios.get('/auth/me');
  return response.data;
};
