import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  images: string[];
  status: string;
  description: string;
}

interface ErrorResponse {
  message: string;
}

interface GetVehicleResponse {
  success: boolean;
  vehicle?: Vehicle;
  error?: string;
}

export const getVehicleById = async (vehicleId: string): Promise<GetVehicleResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.VEHICLE_DETAILS(vehicleId));
    return { success: true, vehicle: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to fetch vehicle details'
    };
  }
}; 