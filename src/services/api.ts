import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('API Request:', {
    url: config.url,
    method: config.method,
    hasToken: !!token,
    headers: config.headers,
    data: config.data instanceof FormData ? 'FormData' : config.data
  });
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Don't modify Content-Type for FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: {
        headers: error.config?.headers,
        data: error.config?.data instanceof FormData ? 'FormData' : error.config?.data
      }
    });

    if (error.response?.status === 401) {
      console.log('Unauthorized request, clearing auth state');
      // Clear auth state and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('sessionExpires');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;