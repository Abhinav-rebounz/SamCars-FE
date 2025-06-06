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
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    const response = await api.post(API_ENDPOINTS.LOGIN, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
  }
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string = 'customer' // optional default
) => {
  try {
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);

    const response = await api.post(API_ENDPOINTS.REGISTER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Registration failed'
    };
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