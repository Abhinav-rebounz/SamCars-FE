import { api, API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  vin: string;
  exterior_color?: string;
  interior_color?: string;
  transmission?: string;
  body_type?: string;
  fuel_type?: string;
  engine?: string;
  condition?: string;
  status: string;
  description: string;
  features?: string[];
  tags?: string[];
  images: string[];
  location?: string;
  is_featured?: boolean;
  stock_number?: string;
  carfax_link?: string;
  created_at?: string;
  updated_at?: string;
}

interface ErrorResponse {
  message: string;
  error?: string;
  details?: string;
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
  id: v.vehicle_id?.toString() || v.id?.toString(),
  make: v.make,
  model: v.model,
  year: v.year,
  price: parseFloat(v.price),
  mileage: v.mileage,
  vin: v.vin,
  exterior_color: v.exterior_color || '',
  interior_color: v.interior_color || '',
  transmission: v.transmission || '',
  body_type: v.body_type || '',
  fuel_type: v.fuel_type || '',
  engine: v.engine || '',
  condition: v.condition || '',
  status: v.status || 'available',
  description: v.description || '',
  features: Array.isArray(v.features) ? v.features : (v.features ? JSON.parse(v.features) : []),
  tags: Array.isArray(v.tags) ? v.tags : (v.tags ? JSON.parse(v.tags) : []),
  images: Array.isArray(v.images) ? v.images : (Array.isArray(v.image_urls) ? v.image_urls : (v.image_url ? [v.image_url] : [])),
  location: v.location || '',
  is_featured: v.is_featured || false,
  stock_number: v.stock_number || '',
  carfax_link: v.carfax_link || '',
  created_at: v.created_at,
  updated_at: v.updated_at,
});

export const addVehicle = async (vehicleData: FormData): Promise<AddVehicleResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.ADD_VEHICLE, vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.status === 'success') {
      return { success: true, vehicle: mapBackendVehicle(response.data.data) };
    } else {
      return { success: false, error: response.data.message || 'Failed to add vehicle' };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to add vehicle'
    };
  }
};

export const updateVehicle = async (vehicleData: FormData): Promise<AddVehicleResponse> => {
  try {
    const vehicleId = vehicleData.get('id') as string;
    if (!vehicleId) {
      return { success: false, error: 'Vehicle ID is required for update' };
    }

    // Remove id from formData as it's passed in URL
    vehicleData.delete('id');

    const response = await api.put(API_ENDPOINTS.UPDATE_VEHICLE(vehicleId), vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Backend update response:', response.data);
    
    if (response.data.status === 'success') {
      // For update, we don't need to return the vehicle data since it's just a success confirmation
      return { success: true };
    } else {
      return { success: false, error: response.data.message || 'Failed to update vehicle' };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Update vehicle error:', axiosError.response?.data);
    
    // Handle specific constraint violations
    if (axiosError.response?.data?.details) {
      const details = axiosError.response.data.details;
      if (details.includes('vehicles_stock_number_key')) {
        return {
          success: false,
          error: 'Stock number already exists. Please use a unique stock number.'
        };
      } else if (details.includes('vehicles_vin_key')) {
        return {
          success: false,
          error: 'VIN number already exists. Please use a unique VIN.'
        };
      } else if (details.includes('unique constraint')) {
        return {
          success: false,
          error: 'A field with this value already exists. Please use a unique value.'
        };
      }
    }
    
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to update vehicle'
    };
  }
};

export const getInventory = async (filters?: Record<string, any>): Promise<GetInventoryResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.FETCH_VEHICLES, { params: filters });
    
    if (response.data.status === 'success' && response.data.data) {
      const vehicles = Array.isArray(response.data.data.vehicles) 
        ? response.data.data.vehicles.map(mapBackendVehicle)
        : [];
      
      return { 
        success: true, 
        vehicles,
        pagination: response.data.data.pagination
      };
    } else {
      return {
        success: false,
        error: response.data.message || 'Failed to fetch inventory'
      };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to fetch inventory'
    };
  }
};

export const deleteVehicle = async (vehicleId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await api.delete(API_ENDPOINTS.DELETE_VEHICLE(vehicleId));
    
    if (response.data.status === 'success') {
      return { success: true };
    } else {
      return { success: false, error: response.data.message || 'Failed to delete vehicle' };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to delete vehicle'
    };
  }
};

export const getVehicleById = async (vehicleId: string): Promise<{ success: boolean; data?: Vehicle; error?: string }> => {
  try {
    const response = await api.get(API_ENDPOINTS.VEHICLE_DETAILS(vehicleId));
    console.log('Raw backend response for vehicle details:', response.data);
    
    if (response.data.status === 'success' && response.data.data) {
      console.log('Raw vehicle data from backend:', response.data.data);
      const mappedVehicle = mapBackendVehicle(response.data.data);
      console.log('Mapped vehicle data:', mappedVehicle);
      console.log('Mapped stock_number:', mappedVehicle.stock_number);
      console.log('Mapped location:', mappedVehicle.location);
      
      return { 
        success: true, 
        data: mappedVehicle
      };
    } else {
      return {
        success: false,
        error: response.data.message || 'Failed to fetch vehicle'
      };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to fetch vehicle'
    };
  }
};