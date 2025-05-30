import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(API_ENDPOINTS.LOGIN, { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Login failed' };
  }
};

export const register = async (firstName: string, lastName: string, email: string, password: string) => {
  try {
    const response = await api.post(API_ENDPOINTS.REGISTER, {
      email,
      first_name: firstName,
      last_name: lastName,
      password
    });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Registration failed' };
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(userId));
    return { success: true, user: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Failed to fetch user' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};