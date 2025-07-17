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

export interface InventoryFilters {
  category?: string;
  limit?: number;
  page?: number;
  search?: string;
  sort_by?: 'date_added' | 'price' | 'year' | 'mileage' | 'make';
  sort_order?: 'asc' | 'desc';
  status?: string;
}

export interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface FilterStats {
  total_available: number;
  total_sold: number;
  categories: {
    sedan: number;
    suv: number;
    truck: number;
    electric: number;
    luxury: number;
    compact: number;
  };
}

export interface GetInventoryResponse {
  success: boolean;
  vehicles?: Vehicle[];
  pagination?: PaginationInfo;
  filter_stats?: FilterStats;
  error?: string;
}

const mapBackendVehicle = (v: any): Vehicle => ({
  id: v.vehicle_id?.toString() || v.id?.toString(),
  make: v.make,
  model: v.model,
  year: v.year,
  price: parseFloat(v.price ?? v.vehicle_price ?? v.amount ?? '0'),
  mileage: v.mileage,
  vin: v.vin,
  exterior_color: v.exterior_color || v.exteriorColour || '',
  interior_color: v.interior_color || v.interiorColour || '',
  transmission: v.transmission || '',
  body_type: v.body_type || '',
  fuel_type: v.fuel_type || '',
  engine: v.engine ?? v.engine_type ?? '',
  condition: v.condition || '',
  status: v.status || 'available',
  description: v.description || '',
  features: Array.isArray(v.features) ? v.features : (v.features ? JSON.parse(v.features) : []),
  tags: Array.isArray(v.tags) ? v.tags : (v.tags ? JSON.parse(v.tags) : []),
  images: Array.isArray(v.images) ? v.images : (Array.isArray(v.image_urls) ? v.image_urls : (v.image_url ? [v.image_url] : [])),
  location: v.location ?? v.vehicle_location ?? '',
  is_featured: v.is_featured ?? v.featured ?? false,
  stock_number: v.stock_number ?? v.stocknumber ?? '',
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

export const getInventory = async (filters?: InventoryFilters): Promise<GetInventoryResponse> => {
  try {
    console.log('Fetching inventory with filters:', filters);
    console.log('Using endpoint:', API_ENDPOINTS.INVENTORY);
    
    const response = await api.get(API_ENDPOINTS.INVENTORY, { 
      params: {
        limit: filters?.limit || 10,
        page: filters?.page || 1,
        search: filters?.search || '',
        sort_by: filters?.sort_by || 'date_added',
        sort_order: filters?.sort_order || 'desc',
        status: filters?.status || 'all',
        category: filters?.category || 'all'
      }
    });
    
    console.log('Inventory API response:', response.data);
    
    if (response.data.status === 'success' && response.data.data) {
      const { vehicles, pagination, filter_stats } = response.data.data;
      
      return { 
        success: true, 
        vehicles: Array.isArray(vehicles) ? vehicles.map(mapBackendVehicle) : [],
        pagination,
        filter_stats
      };
    } else {
      return {
        success: false,
        error: response.data.message || 'Failed to fetch inventory'
      };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error('Error fetching inventory:', axiosError.response?.data);
    console.error('Error config:', axiosError.config);
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