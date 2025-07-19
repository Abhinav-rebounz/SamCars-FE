import { api, API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

interface User {
  userId: string | number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  driverLicense?: string;
  dateOfBirth?: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UsersResponse {
  status: 'success' | 'error';
  data?: {
    users: User[];
  };
  message?: string;
}

interface ErrorResponse {
  status: 'error';
  message: string;
}

export const fetchAllUsers = async () => {
  try {
    const response = await api.get<UsersResponse>(API_ENDPOINTS.USERS_LIST);
    
    if (response.data.status === 'success' && response.data.data?.users) {
      return {
        success: true,
        users: response.data.data.users.map(user => ({
          ...user,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
          displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim() ? `${user.firstName} ${user.lastName} (${user.email})` : user.email
        }))
      };
    }
    
    throw new Error(response.data.message || 'Failed to fetch users');
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to fetch users',
      users: []
    };
  }
};

export const fetchUserById = async (userId: string | number) => {
  try {
    const response = await api.get<UsersResponse>(`${API_ENDPOINTS.USERS}/${userId}`);
    
    if (response.data.status === 'success' && response.data.data?.user) {
      const user = response.data.data.user;
      return {
        success: true,
        user: {
          ...user,
          name: `${user.firstName} ${user.lastName}`
        }
      };
    }
    
    throw new Error(response.data.message || 'Failed to fetch user');
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to fetch user'
    };
  }
}; 