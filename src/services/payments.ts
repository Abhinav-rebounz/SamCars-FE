import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const makePayment = async (data: {
  type: 'reserve' | 'service';
  amount: number;
  vin?: string;
  serviceId?: string;
}) => {
  try {
    const response = await api.post(API_ENDPOINTS.PAYMENTS, data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Payment failed' };
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