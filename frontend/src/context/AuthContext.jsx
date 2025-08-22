import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

// إنشاء السياق
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // بيانات المستخدم
  const [loading, setLoading] = useState(true);

  // جلب بيانات المستخدم عند التحميل
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // جلب التوكن من التخزين المحلي
        if (token) {
          const response = await axios.get('/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // تسجيل الدخول وتخزين التوكن
  const login = async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  // تسجيل الخروج
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
