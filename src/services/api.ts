import axios from 'axios';
import { API_BASE_URL, getAuthHeader } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const headers = getAuthHeader();
  config.headers = { ...config.headers, ...headers };
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;