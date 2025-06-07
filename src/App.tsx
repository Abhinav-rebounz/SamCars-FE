import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Customer Views
import Layout from './components/Layout';
import HomePage from './pages/customer/HomePage';
import ServicesPage from './pages/customer/ServicesPage';
import ContactPage from './pages/customer/ContactPage';
import AccountPage from './pages/customer/AccountPage';
import WishlistPage from './pages/customer/WishlistPage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';
import PrivateRoute from './components/PrivateRoute';

// Admin Views
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
// import AdminAppointments from './pages/admin/Appointments';
import AdminPayments from './pages/admin/Payments';
import AdminAuctions from './pages/admin/Auctions';
import AdminServices from './pages/admin/Services';
import AdminLogin from './pages/admin/Login';
import AdminProfile from './pages/admin/Profile';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="account" element={<PrivateRoute><AccountPage /></PrivateRoute>} />
            <Route path="wishlist" element={<PrivateRoute><WishlistPage /></PrivateRoute>} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            {/* <Route path="appointments" element={<AdminAppointments />} /> */}
            <Route path="payments" element={<AdminPayments />} />
            <Route path="auctions" element={<AdminAuctions />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;