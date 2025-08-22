import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { roles } from '../utils/roles';

/**
 * ProtectedRoute: يحمي الصفحات بناءً على تسجيل الدخول والدور
 * @param {ReactNode} children - المكون الذي سيتم عرضه إذا تم السماح بالوصول
 * @param {Array} allowedRoles - مصفوفة بالأدوار المسموح لها
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // شاشة تحميل أثناء جلب بيانات المستخدم
  }

  if (!user) {
    return <Navigate to="/login" />; // إعادة التوجيه لتسجيل الدخول إذا لم يكن المستخدم موجود
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // إعادة التوجيه للصفحة الرئيسية إذا الدور غير مسموح
  }

  return children; // السماح بالوصول إذا كل الشروط مطابقة
};

export default ProtectedRoute;
