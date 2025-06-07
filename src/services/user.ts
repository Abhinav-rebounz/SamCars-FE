import api from './api';
import { API_ENDPOINTS } from '../config/api';

export interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    role: string;
}

interface ProfileResponse {
    success: boolean;
    user?: UserProfile;
    error?: string;
}

export const getUserProfile = async (): Promise<ProfileResponse> => {
    try {
        const response = await api.get(API_ENDPOINTS.USER_PROFILE);
        return {
            success: true,
            user: response.data.user
        };
    } catch (error: any) {
        console.error('Error fetching user profile:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to fetch profile'
        };
    }
};

export const updateUserProfile = async (userData: Partial<UserProfile>): Promise<ProfileResponse> => {
    try {
        // Create FormData to handle multipart/form-data
        const formData = new FormData();
        Object.entries(userData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        const response = await api.put(API_ENDPOINTS.USER_PROFILE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        // Update the stored user data in localStorage
        if (response.data.success) {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        return {
            success: true,
            user: response.data.user
        };
    } catch (error: any) {
        console.error('Error updating user profile:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to update profile'
        };
    }
}; 