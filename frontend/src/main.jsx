import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // ✅ استيراد createRoot فقط
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css';

// ✅ استخدم createRoot مباشرة بدون ReactDOM
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
