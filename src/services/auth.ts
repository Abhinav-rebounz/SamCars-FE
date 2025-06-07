import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  sessionExpires: string;
  user: {
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
  };
  message: string;
}

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  sessionExpires: string;
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

    const response = await api.post<LoginResponse>(API_ENDPOINTS.LOGIN, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const { accessToken, refreshToken, sessionExpires, user } = response.data;
    
    // Store tokens and session info
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('sessionExpires', sessionExpires);
    localStorage.setItem('user', JSON.stringify(user));

    // Update API instance authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return { 
      success: true, 
      user,
      sessionExpires 
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Login error:', axiosError.response?.data || axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Login failed'
    };
  }
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: string = 'customer'
) => {
  try {
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);

    const response = await api.post<RegisterResponse>(API_ENDPOINTS.REGISTER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const { accessToken, refreshToken, sessionExpires, user } = response.data;
    
    // Store tokens and session info
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('sessionExpires', sessionExpires);
    localStorage.setItem('user', JSON.stringify(user));

    // Update API instance authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    return { 
      success: true, 
      user,
      sessionExpires 
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Registration error:', axiosError.response?.data || axiosError.message);
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Registration failed'
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
  // Clear all auth-related items from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('sessionExpires');
  localStorage.removeItem('user');
  
  // Clear the authorization header
  delete api.defaults.headers.common['Authorization'];
};

// Add a function to check if the session is expired
export const isSessionExpired = (): boolean => {
  const sessionExpires = localStorage.getItem('sessionExpires');
  if (!sessionExpires) return true;
  
  const expiryDate = new Date(sessionExpires);
  return expiryDate <= new Date();
};