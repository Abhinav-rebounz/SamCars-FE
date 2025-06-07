import axios from '../config/axios';
import { API_ENDPOINTS } from '../config/api';

export interface Payment {
  id: string;
  customerName: string;
  email: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  paymentProof?: string;
  paymentMethod: string;
  transactionId?: string;
}

export const getPayments = async (page = 1, limit = 10, filters = {}) => {
  const response = await axios.get('/payments', {
    params: {
      page,
      limit,
      ...filters
    }
  });
  return response.data;
};

export const addOfflinePayment = async (paymentData: FormData) => {
  const response = await axios.post('/payments/offline', paymentData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const refundPayment = async (paymentId: string, reason: string) => {
  const response = await axios.post(`/payments/${paymentId}/refund`, { reason });
  return response.data;
};

export const getPaymentStats = async () => {
  const response = await axios.get('/payments/stats');
  return response.data;
};

export const exportPayments = async (filters = {}) => {
  const response = await axios.get('/payments/export', {
    params: filters,
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `payments-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}; 