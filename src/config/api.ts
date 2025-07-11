import axios from 'axios';

export const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Clear auth state and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleApiError = (error: any) => {
    if (error.response) {
        console.error('API Error Response:', error.response.data);
        return error.response.data.message || 'An error occurred';
    } else if (error.request) {
        console.error('API Error Request:', error.request);
        return 'No response from server';
    } else {
        console.error('API Error:', error.message);
        return error.message;
    }
};

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    USER_BY_ID: (id: string) => `/users/fetch-by-id?id=${id}`,
    UPDATE_PROFILE: '/users/update-profile',
    
    // Vehicles
    VEHICLES: '/vehicles',
    VEHICLE_DETAILS: (id: string) => `/vehicles/fetch-by-id?id=${id}`,
    
    // Inventory
    ADD_VEHICLE: '/inventory/add-vehicle',
    FETCH_VEHICLES: '/inventory/fetch-vehicles',
    UPDATE_VEHICLE: (id: string) => `/inventory/vehicles/update?id=${id}`,
    DELETE_VEHICLE: (id: string) => `/inventory/vehicles/delete/${id}`,
    
    // Auction Tracker
    ADD_AUCTION_PURCHASE: '/auction-tracker/add-new',
    FETCH_AUCTION_PURCHASES: '/auction-tracker/fetch-all',
    AUCTION_DASHBOARD: '/auction-tracker/dashboard-summary',
    UPDATE_AUCTION_PURCHASE: (id: string) => `/auction-tracker/update?auction_id=${id}`,
    DELETE_AUCTION_PURCHASE: (id: string) => `/auction-tracker/delete/${id}`,
    // Payments
    PAYMENTS: '/payments',
};