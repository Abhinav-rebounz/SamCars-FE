import { api, API_ENDPOINTS, handleApiError } from '../config/api';

interface CheckoutSession {
  url: string;
  sessionId: string;
}

export const createCheckoutSession = async (vehicleId: string): Promise<CheckoutSession> => {
  try {
    const response = await api.post(API_ENDPOINTS.CREATE_CHECKOUT_SESSION, {
      vehicleId
    });
    
    if (!response.data?.data?.url) {
      throw new Error('Invalid response from server');
    }
    
    return {
      url: response.data.data.url,
      sessionId: response.data.data.sessionId
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error(handleApiError(error));
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