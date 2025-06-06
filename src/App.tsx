import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Customer Views
import Layout from './components/Layout';
import HomePage from './pages/customer/HomePage';
import InventoryPage from './pages/customer/InventoryPage';
import VehicleDetailsPage from './pages/customer/VehicleDetailsPage';
import ServicesPage from './pages/customer/ServicesPage';
import ContactPage from './pages/customer/ContactPage';
import AccountPage from './pages/customer/AccountPage';
import WishlistPage from './pages/customer/WishlistPage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';
import SellCarPage from './pages/customer/SellCarPage';

// Admin Views
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminInventory from './pages/admin/Inventory';
// import AdminAppointments from './pages/admin/Appointments';
import AdminPayments from './pages/admin/Payments';
import AdminAuctions from './pages/admin/Auctions';
import AdminServices from './pages/admin/Services';
import AdminLogin from './pages/admin/Login';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Customer Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="inventory/:id" element={<VehicleDetailsPage />} />
            <Route path="sell-car" element={<SellCarPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="inventory" element={<AdminInventory />} />
            {/* <Route path="appointments" element={<AdminAppointments />} /> */}
            <Route path="payments" element={<AdminPayments />} />
            <Route path="auctions" element={<AdminAuctions />} />
            <Route path="services" element={<AdminServices />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;