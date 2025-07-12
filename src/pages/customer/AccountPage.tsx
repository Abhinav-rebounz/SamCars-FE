import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Car, Calendar, FileText, CreditCard, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from '../../services/auth';
import { fetchPayments } from '../../services/payments';

const AccountPage: React.FC = () => {
  const { user, isAuthenticated, logout, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Fetch payments from backend
  useEffect(() => {
    const fetchUserPayments = async () => {
      setPaymentsLoading(true);
      setPaymentsError(null);
      try {
        const response = await fetchPayments({ user_id: user?.id });
        if (response.success && response.data && Array.isArray(response.data.data)) {
          setPayments(response.data.data);
        } else {
          setPaymentsError(response.error || 'Failed to fetch payments');
        }
      } catch (err) {
        setPaymentsError('Failed to fetch payments');
      } finally {
        setPaymentsLoading(false);
      }
    };
    if (user?.id) fetchUserPayments();
  }, [user?.id]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <h1 className="heading-lg mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 bg-blue-700 text-white">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-blue-700">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{user?.name}</h2>
                    <p className="text-blue-100">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full flex items-center px-4 py-2 rounded-md ${
                        activeTab === 'profile'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <User className="h-5 w-5 mr-3" />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('payments')}
                      className={`w-full flex items-center px-4 py-2 rounded-md ${
                        activeTab === 'payments'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 mr-3" />
                      <span>Payments</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                  
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setProfileError(null);
                    setProfileSuccess(null);
                    setProfileLoading(true);
                    if (!profileForm.name || !profileForm.email) {
                      setProfileError('Name and email are required.');
                      setProfileLoading(false);
                      return;
                    }
                    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmNewPassword) {
                      setProfileError('New passwords do not match.');
                      setProfileLoading(false);
                      return;
                    }
                    const [firstName, ...rest] = profileForm.name.split(' ');
                    const lastName = rest.join(' ');
                    const response = await updateProfile({
                      first_name: firstName,
                      last_name: lastName,
                      email: profileForm.email,
                      phone: profileForm.phone,
                      current_password: profileForm.currentPassword,
                      new_password: profileForm.newPassword,
                    });
                    if (response.success && response.user) {
                      setUser(response.user);
                      setProfileSuccess('Profile updated successfully.');
                    } else {
                      setProfileError(response.error || 'Failed to update profile.');
                    }
                    setProfileLoading(false);
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                          disabled={profileLoading}
                        />
                      </div>
                      <div>
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          required
                          disabled={profileLoading}
                        />
                      </div>
                      <div>
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          disabled={profileLoading}
                        />
                      </div>
                      <div>
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          value={profileForm.address}
                          onChange={e => setProfileForm(f => ({ ...f, address: e.target.value }))}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          disabled={profileLoading}
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h3 className="font-semibold mb-4">Change Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="form-label">Current Password</label>
                          <input
                            type="password"
                            value={profileForm.currentPassword}
                            onChange={e => setProfileForm(f => ({ ...f, currentPassword: e.target.value }))}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            disabled={profileLoading}
                          />
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="form-label">New Password</label>
                            <input
                              type="password"
                              value={profileForm.newPassword}
                              onChange={e => setProfileForm(f => ({ ...f, newPassword: e.target.value }))}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              disabled={profileLoading}
                            />
                          </div>
                          <div>
                            <label className="form-label">Confirm New Password</label>
                            <input
                              type="password"
                              value={profileForm.confirmNewPassword}
                              onChange={e => setProfileForm(f => ({ ...f, confirmNewPassword: e.target.value }))}
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                              disabled={profileLoading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {(profileError || profileSuccess) && (
                      <div className={`mt-4 p-2 rounded ${profileError ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>{profileError || profileSuccess}</div>
                    )}
                    <div className="flex justify-end mt-6">
                      <button type="submit" className="btn-primary" disabled={profileLoading}>{profileLoading ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">My Payments</h2>
                  {paymentsLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading payments...</div>
                  ) : paymentsError ? (
                    <div className="text-center py-8 text-red-500">{paymentsError}</div>
                  ) : payments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No payments found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap">{payment.description}</td>
                              <td className="px-6 py-4 whitespace-nowrap">${payment.amount.toFixed(2)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{new Date(payment.date).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  payment.status === 'Completed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : payment.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;