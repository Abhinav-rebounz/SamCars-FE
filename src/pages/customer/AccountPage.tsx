import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Car, Calendar, FileText, CreditCard, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AccountPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Mock data for the account page
  const testDrives = [
    {
      id: '1',
      vehicle: '2020 Toyota Camry',
      date: '2023-10-15',
      time: '2:00 PM',
      status: 'Confirmed',
    },
    {
      id: '2',
      vehicle: '2021 Honda CR-V',
      date: '2023-10-20',
      time: '11:00 AM',
      status: 'Pending',
    },
  ];
  
  const serviceAppointments = [
    {
      id: '1',
      service: 'Oil Change',
      vehicle: '2018 Ford F-150',
      date: '2023-10-18',
      time: '9:30 AM',
      status: 'Confirmed',
    },
  ];
  
  const payments = [
    {
      id: '1',
      description: 'Vehicle Hold Deposit - 2020 Toyota Camry',
      amount: 500.00,
      date: '2023-10-10',
      status: 'Completed',
    },
    {
      id: '2',
      description: 'Service Payment - Oil Change',
      amount: 49.99,
      date: '2023-09-25',
      status: 'Completed',
    },
  ];
  
  const documents = [
    {
      id: '1',
      name: 'Purchase Agreement - 2020 Toyota Camry',
      date: '2023-10-10',
      type: 'PDF',
    },
    {
      id: '2',
      name: 'Service Receipt - Oil Change',
      date: '2023-09-25',
      type: 'PDF',
    },
  ];

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
                      onClick={() => setActiveTab('test-drives')}
                      className={`w-full flex items-center px-4 py-2 rounded-md ${
                        activeTab === 'test-drives'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Car className="h-5 w-5 mr-3" />
                      <span>Test Drives</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('service')}
                      className={`w-full flex items-center px-4 py-2 rounded-md ${
                        activeTab === 'service'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Calendar className="h-5 w-5 mr-3" />
                      <span>Service Appointments</span>
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
                      onClick={() => setActiveTab('documents')}
                      className={`w-full flex items-center px-4 py-2 rounded-md ${
                        activeTab === 'documents'
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <FileText className="h-5 w-5 mr-3" />
                      <span>Documents</span>
                    </button>
                  </li>
                  <li>
                    <Link
                      to="/wishlist"
                      className="w-full flex items-center px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <Heart className="h-5 w-5 mr-3" />
                      <span>Wishlist</span>
                    </Link>
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
                  
                  <form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="form-label">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue="(555) 123-4567"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          defaultValue="123 Main St, Anytown, USA"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
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
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="form-label">New Password</label>
                            <input
                              type="password"
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                          </div>
                          <div>
                            <label className="form-label">Confirm New Password</label>
                            <input
                              type="password"
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button type="submit" className="btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Test Drives Tab */}
              {activeTab === 'test-drives' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Test Drive Appointments</h2>
                    <Link to="/inventory" className="btn-outline">
                      Schedule New Test Drive
                    </Link>
                  </div>
                  
                  {testDrives.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Vehicle
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {testDrives.map((appointment) => (
                            <tr key={appointment.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{appointment.vehicle}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-500">{appointment.time}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  appointment.status === 'Confirmed' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {appointment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-700 hover:text-blue-800 mr-3">
                                  Reschedule
                                </button>
                                <button className="text-red-600 hover:text-red-700">
                                  Cancel
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Car className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No test drives scheduled</h3>
                      <p className="text-gray-500 mb-4">You haven't scheduled any test drives yet.</p>
                      <Link to="/inventory" className="btn-primary">
                        Browse Inventory
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* Service Appointments Tab */}
              {activeTab === 'service' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Service Appointments</h2>
                    <Link to="/services" className="btn-outline">
                      Schedule New Service
                    </Link>
                  </div>
                  
                  {serviceAppointments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Service
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Vehicle
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {serviceAppointments.map((appointment) => (
                            <tr key={appointment.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{appointment.service}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{appointment.vehicle}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-500">{appointment.time}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {appointment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-700 hover:text-blue-800 mr-3">
                                  Reschedule
                                </button>
                                <button className="text-red-600 hover:text-red-700">
                                  Cancel
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No service appointments</h3>
                      <p className="text-gray-500 mb-4">You haven't scheduled any service appointments yet.</p>
                      <Link to="/services" className="btn-primary">
                        View Services
                      </Link>
                    </div>
                  )}
                </div>
              )}
              
              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Payment History</h2>
                  
                  {payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Receipt
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {payments.map((payment) => (
                            <tr key={payment.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{payment.description}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">${payment.amount.toFixed(2)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(payment.date).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {payment.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-700 hover:text-blue-800">
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No payment history</h3>
                      <p className="text-gray-500">You haven't made any payments yet.</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Documents</h2>
                  
                  {documents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Document Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {documents.map((document) => (
                            <tr key={document.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{document.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(document.date).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{document.type}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-700 hover:text-blue-800 mr-3">
                                  View
                                </button>
                                <button className="text-blue-700 hover:text-blue-800">
                                  Download
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No documents</h3>
                      <p className="text-gray-500">You don't have any documents yet.</p>
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