import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/DashboardHome';
import DoctorList from './pages/patient/DoctorList';
import Appointments from './pages/common/Appointments';
import ScheduleManager from './pages/doctor/ScheduleManager';
import DoctorPatients from './pages/doctor/DoctorPatients'; // Import new page
import LiveQueue from './pages/patient/LiveQueue';
import ThemeSettings from './pages/admin/ThemeSettings';
import ManageDoctors from './pages/admin/ManageDoctors';
import AdminAppointments from './pages/admin/AdminAppointments';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/common/Profile';

import PublicLayout from './components/layout/PublicLayout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 text-gray-900 font-sans transition-colors duration-300">
            <Routes>
              {/* Public Routes with Navbar */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/doctors" element={<DoctorList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<MainLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="appointments" element={<Appointments />} />
                  <Route path="doctors" element={<DoctorList />} />
                  <Route path="schedule" element={<ScheduleManager />} />
                  <Route path="patients" element={<DoctorPatients />} />
                  <Route path="live-queue" element={<LiveQueue />} />
                  <Route path="admin/doctors" element={<ManageDoctors />} />
                  <Route path="admin/appointments" element={<AdminAppointments />} />
                  <Route path="admin/reports" element={<div>Reports Page</div>} />
                  <Route path="admin/settings" element={<ThemeSettings />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Route>

              <Route path="/unauthorized" element={<div className="p-10 text-center text-red-500">Unauthorized Access</div>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
