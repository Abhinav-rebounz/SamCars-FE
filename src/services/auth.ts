import { api, API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
  message: string;
}

interface ErrorResponse {
  message: string;
  error?: string;
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

    const { token, user } = response.data;
    
    // Create user object with name field for compatibility
    const userWithName = {
      ...user,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role as 'customer' | 'admin'
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithName));
    
    return { success: true, user: userWithName, token };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Login failed'
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

    const response = await api.post<LoginResponse>(API_ENDPOINTS.REGISTER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const { token, user } = response.data;
    
    // Create user object with name field for compatibility
    const userWithName = {
      ...user,
      name: `${user.first_name} ${user.last_name}`,
      role: user.role as 'customer' | 'admin'
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userWithName));
    
    return { success: true, user: userWithName, token };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Registration failed'
    };
  }
};

export const fetchUserById = async (userId: string) => {
  try {
    const response = await api.get(API_ENDPOINTS.USER_BY_ID(userId));
    return { success: true, user: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return { 
      success: false, 
      error: axiosError.response?.data?.message || 'Failed to fetch user' 
    };
  }
};

export const updateProfile = async (profileData: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  current_password?: string;
  new_password?: string;
}) => {
  try {
    const formData = new FormData();
    formData.append('first_name', profileData.first_name);
    formData.append('last_name', profileData.last_name);
    formData.append('email', profileData.email);
    
    if (profileData.phone) {
      formData.append('phone', profileData.phone);
    }
    
    if (profileData.current_password) {
      formData.append('current_password', profileData.current_password);
    }
    
    if (profileData.new_password) {
      formData.append('new_password', profileData.new_password);
    }

    const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      // Update local storage with new user data
      const updatedUser = {
        ...response.data.user,
        name: `${response.data.user.first_name} ${response.data.user.last_name}`,
        role: response.data.user.role as 'customer' | 'admin'
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { 
        success: true, 
        user: updatedUser, 
        message: response.data.message 
      };
    } else {
      return { 
        success: false, 
        error: response.data.message || 'Failed to update profile' 
      };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to update profile'
    };
  }
};

export const getAdminDashboard = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.AUCTION_DASHBOARD);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return { 
      success: false, 
      error: axiosError.response?.data?.message || 'Failed to fetch dashboard data' 
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};