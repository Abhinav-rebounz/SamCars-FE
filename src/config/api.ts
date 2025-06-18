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

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const handleApiError = (error: any) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Error Response:', error.response.data);
        return error.response.data.message || 'An error occurred';
    } else if (error.request) {
        // The request was made but no response was received
        console.error('API Error Request:', error.request);
        return 'No response from server';
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error('API Error:', error.message);
        return error.message;
    }
};

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    USER_BY_ID: (id: string) => `/users/fetch-by-id/${id}`,
    
    // Vehicles
    VEHICLES: '/vehicles',
    VEHICLE_DETAILS: (id: string) => `/vehicles/fetch-by-id?id=${id}`,
    VEHICLE_RESERVE: '/vehicles/reserve',
    
    // Services
    SERVICES: '/services',
    SERVICE_BOOKING: '/services/book',
    SERVICE_PAYMENT: '/services/payment',
    
    // Payments
    PAYMENTS: '/payments',
    PAYMENT_VERIFY: '/payments/verify',

    //Inventory
    ADD_NEW_VEHICLE: '/inventory/add-vehicle',
    GET_INVENTORY: '/inventory/fetch-vehicles',
    UPDATE_VEHICLE: (id: string) => `/inventory/vehicles/update/${id}`,
    DELETE_VEHICLE: (id: string) => `/inventory/vehicles/delete/${id}`,
};