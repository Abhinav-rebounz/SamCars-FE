export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/users/login',
  REGISTER: '/users/register',
  USER_BY_ID: (id: string) => `/users/fetch-by-id/${id}`,
  
  // Vehicles
  VEHICLES: '/vehicles',
  VEHICLE_DETAILS: (id: string) => `/vehicles/${id}`,
  VEHICLE_RESERVE: '/vehicles/reserve',
  
  // Services
  SERVICES: '/services',
  SERVICE_BOOKING: '/services/book',
  SERVICE_PAYMENT: '/services/payment',
  
  // Payments
  PAYMENTS: '/payments',
  PAYMENT_VERIFY: '/payments/verify',

  //Inventory
  ADD_NEW_VEHICLE: '/inventory/add-vehicle',
  
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleApiError = (error: any) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred';
  }
  if (error.request) {
    return 'Network error. Please check your connection.';
  }
  return 'An unexpected error occurred';
};