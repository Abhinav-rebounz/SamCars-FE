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
  vin: string;
  exteriorColor: string;
  interiorColor: string;
  transmission: string;
  bodyType: string;
  description: string;
  isSold: boolean;
  tags: string[];
  images: string[];
  dateAdded: string;
}

interface ErrorResponse {
  message: string;
}

interface AddVehicleResponse {
  success: boolean;
  vehicle?: Vehicle;
  error?: string;
}

interface GetInventoryResponse {
  success: boolean;
  vehicles?: Vehicle[];
  pagination?: any;
  error?: string;
}

const mapBackendVehicle = (v: any): Vehicle => ({
  id: v.id.toString(),
  make: v.make,
  model: v.model,
  year: v.year,
  price: v.price,
  mileage: v.mileage,
  vin: v.vin,
  exteriorColor: v.exterior_color || '',
  interiorColor: v.interior_color || '',
  transmission: v.transmission || '',
  bodyType: v.body_type || '',
  description: v.description || '',
  isSold: v.status !== 'available',
  tags: v.tags || [],
  images: v.image_url ? [v.image_url] : [],
  dateAdded: v.date_added || new Date().toISOString(),
});

export const addVehicle = async (vehicleData: FormData): Promise<AddVehicleResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.ADD_VEHICLE, vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { success: true, vehicle: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to add vehicle'
    };
  }
};

export const updateVehicle = async (vehicleData: FormData): Promise<AddVehicleResponse> => {
  try {
    const response = await api.put(API_ENDPOINTS.UPDATE_VEHICLE, vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { success: true, vehicle: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to update vehicle'
    };
  }
};

export const getInventory = async (filters?: Record<string, any>): Promise<GetInventoryResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.FETCH_VEHICLES, { params: filters });
    if (response.data.status === 'success' && response.data.data) {
      return { 
        success: true, 
        vehicles: response.data.data.vehicles.map(mapBackendVehicle),
        pagination: response.data.data.pagination
      };
    }
    return {
      success: false,
      error: 'Failed to fetch inventory'
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to fetch inventory'
    };
  }
};

export const deleteVehicle = async (vehicleId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await api.delete(API_ENDPOINTS.DELETE_VEHICLE(vehicleId));
    return { success: true };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to delete vehicle'
    };
  }
}; 