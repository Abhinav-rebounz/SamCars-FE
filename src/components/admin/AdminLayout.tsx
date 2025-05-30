import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  // Redirect to login if not authenticated or not an admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;