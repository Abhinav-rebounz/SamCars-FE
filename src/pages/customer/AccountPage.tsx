import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Car, Calendar, FileText, CreditCard, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile, updateUserProfile, UserProfile } from '../../services/user';
import { format, parseISO } from 'date-fns';

const AccountPage: React.FC = () => {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    driver_license: '',
    date_of_birth: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        console.log('Fetching user profile...');
        const result = await getUserProfile();
        console.log('Profile fetch result:', result);
        
        if (result.success && result.user) {
          setUser(result.user);
          setFormData({
            first_name: result.user.first_name,
            last_name: result.user.last_name,
            phone: result.user.phone || '',
            driver_license: result.user.driver_license || '',
            date_of_birth: result.user.date_of_birth || ''
          });
        } else {
          setError(result.error || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('An error occurred while loading your profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await updateUserProfile(formData);
      if (result.success && result.user) {
        setUser(result.user);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('An error occurred while updating the profile');
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not provided';
    try {
      return format(parseISO(dateString), 'PP');
    } catch {
      return 'Invalid date';
    }
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <h1 className="heading-lg mb-8">My Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
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
                  
                  {!isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">First Name</label>
                          <p className="mt-1 text-lg">{user.first_name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Last Name</label>
                          <p className="mt-1 text-lg">{user.last_name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Email</label>
                          <p className="mt-1 text-lg">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Phone</label>
                          <p className="mt-1 text-lg">{user.phone || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Driver's License</label>
                          <p className="mt-1 text-lg">{user.driver_license || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                          <p className="mt-1 text-lg">{formatDate(user.date_of_birth)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">First Name</label>
                          <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Driver's License</label>
                          <input
                            type="text"
                            name="driver_license"
                            value={formData.driver_license}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                          <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
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