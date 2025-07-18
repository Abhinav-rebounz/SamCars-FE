import { api, API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

interface AuthResponse {
  status: 'success' | 'error';
  data?: {
    user: {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'customer' | 'admin';
    };
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

interface ProfileResponse {
  status: 'success' | 'error';
  data?: {
    user: {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role: 'customer' | 'admin';
    };
  };
  message?: string;
}

interface ErrorResponse {
  status: 'error';
  message: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, {
      email,
      password
    });

    if (response.data.status === 'success' && response.data.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: `${user.firstName} ${user.lastName}`
      }));
      
      return { 
        success: true, 
        user: {
          ...user,
          name: `${user.firstName} ${user.lastName}`
        }
      };
    }
    
    throw new Error(response.data.message || 'Login failed');
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
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
  phone?: string
) => {
  try {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.REGISTER, {
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'customer'
    });

    if (response.data.status === 'success' && response.data.data) {
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Store tokens and user data
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        name: `${user.firstName} ${user.lastName}`
      }));
      
      return { 
        success: true, 
        user: {
          ...user,
          name: `${user.firstName} ${user.lastName}`
        }
      };
    }
    
    throw new Error(response.data.message || 'Registration failed');
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Registration failed'
    };
  }
};

export const updateProfile = async (profileData: {
  firstName: string;
  lastName: string;
  phone?: string;
}) => {
  try {
    const response = await api.put<ProfileResponse>(API_ENDPOINTS.UPDATE_PROFILE, profileData);

    if (response.data.status === 'success' && response.data.data?.user) {
      const { user } = response.data.data;
      
      // Update stored user data
      const updatedUser = {
        ...user,
        name: `${user.firstName} ${user.lastName}`
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { 
        success: true, 
        user: updatedUser
      };
    }
    
    throw new Error(response.data.message || 'Failed to update profile');
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to update profile'
    };
  }
};

export const logout = async () => {
  try {
    await api.post(API_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<AuthResponse>(API_ENDPOINTS.REFRESH_TOKEN, {
      refreshToken
    });

    if (response.data.status === 'success' && response.data.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.REQUEST_PASSWORD_RESET, { 
      email 
    });
    return { 
      success: response.data.status === 'success', 
      message: response.data.message 
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to send reset email'
    };
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await api.post<AuthResponse>(API_ENDPOINTS.RESET_PASSWORD, { 
      token, 
      newPassword 
    });
    return { 
      success: response.data.status === 'success', 
      message: response.data.message 
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || 'Failed to reset password'
    };
  }
};