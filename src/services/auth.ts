import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
  };
  message: string;
}

interface ErrorResponse {
  message: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, { email, password });
    const { accessToken, refreshToken, user } = response.data;
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    return { success: true, user };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return { 
      success: false, 
      error: axiosError.response?.data?.message || 'Login failed' 
    };
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
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return { success: false, error: axiosError.response?.data?.message || 'Registration failed' };
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(userId));
    return { success: true, user: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return { success: false, error: axiosError.response?.data?.message || 'Failed to fetch user' };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};