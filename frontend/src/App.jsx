import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Doctors from './pages/Doctors';
import Contact from './pages/Contact';
import Jobs from './pages/Jobs';
import Evaluations from './pages/Evaluations';
import AdminDashboard from './pages/admin/AdminDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import ProtectedRoute from './routes/protectedRoute';
import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import Service from "./components/Services";
import { AuthProvider } from "./context/AuthContext";



function App() {
  return (
     <AuthProvider>
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/services" element={<Service />} />
        <Route path="/evaluations" element={
          <ProtectedRoute>
            <Evaluations />
          </ProtectedRoute>
        } />
        {/* Dashboards */}
        <Route path="/admin" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/doctor" element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient" element={
          <ProtectedRoute role="patient">
            <PatientDashboard />
          </ProtectedRoute>
        } />
        
      </Routes>
      <Footer/>
    </Router>
    </AuthProvider>
  );
}

export default App;
