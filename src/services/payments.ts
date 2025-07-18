import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

export const makePayment = async (data: {
  type: 'reserve' | 'service';
  amount: number;
  vehicle_id?: number;
  user_id?: number;
  serviceId?: string;
}) => {
  try {
    const response = await api.post(API_ENDPOINTS.CREATE_CHECKOUT_SESSION, {
      vehicle_id: data.vehicle_id,
      user_id: data.user_id,
      amount: data.amount,
      type: data.type,
      service_id: data.serviceId
    });
    return { success: true, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return { 
      success: false, 
      error: axiosError.response?.data?.message || 'Payment failed',
      data: null
    };
  }
};

export const verifyVin = async (lastFourDigits: string) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.VEHICLES}?vin=${lastFourDigits}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'VIN verification failed' };
  }
};

// Fetch all payments with optional filters
export const fetchPayments = async (filters?: Record<string, any>) => {
  try {
    const response = await api.get(API_ENDPOINTS.CREATE_CHECKOUT_SESSION, { params: filters });
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return { success: false, error: axiosError.response?.data?.message || 'Failed to fetch payments' };
  }
};

// Add a manual payment
export const addManualPayment = async (data: {
  user_id: string;
  amount: number;
  payment_method: string;
  description: string;
  related_appointment_id?: number;
  related_appointment_type?: string;
  vehicle_id?: number;
  service_id?: number;
  status: string;
  date?: string;
  is_manual?: boolean;
}) => {
  try {
    const payload = { ...data, is_manual: true };
    const response = await api.post(API_ENDPOINTS.CREATE_CHECKOUT_SESSION, payload);
    return { success: true, data: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return { success: false, error: axiosError.response?.data?.message || 'Failed to add manual payment' };
  }
};