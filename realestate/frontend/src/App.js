import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import PropertyListing from './pages/PropertyListing';
import BookingPage from './pages/BookingPage';
import LoginRegister from './pages/LoginRegister';
import PropertyDetail from './pages/PropertyDetail';
import MyBookings from './pages/MyBookings';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Navbar />
          <div className="app-shell">
            <Sidebar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<PropertyListing />} />
                <Route path="/property/:id/book" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
                <Route path="/auth" element={<LoginRegister />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/admin/*" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
