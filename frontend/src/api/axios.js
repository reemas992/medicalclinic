// axios.js
import axios from 'axios';

// إنشاء instance مركزي للـ Axios مع إعدادات أساسية
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// إضافة interceptor لإرفاق توكن المستخدم تلقائياً إذا كان موجوداً
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
