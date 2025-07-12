import { api, API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

interface AuctionPurchase {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  vin: string;
  exterior_color: string;
  interior_color: string;
  transmission: string;
  body_type: string;
  description: string;
  status: string;
  condition: string;
  fuel_type: string;
  tags: string[];
  carfax_link: string;
  purchase_price: number;
  purchase_date: string;
  additional_costs: number;
  list_price: number;
  sold_price: number;
  notes: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

interface ErrorResponse {
  message: string;
  error?: string;
}

interface AddAuctionPurchaseResponse {
  success: boolean;
  purchase?: AuctionPurchase;
  error?: string;
}

interface GetAuctionPurchasesResponse {
  success: boolean;
  purchases?: AuctionPurchase[];
  pagination?: any;
  error?: string;
}

interface AuctionDashboardResponse {
  success: boolean;
  data?: {
    totalInvestment: number;
    totalProfit: number;
    vehiclesPurchased: number;
    vehiclesSold: number;
    recentActivity: any[];
  };
  error?: string;
}

const mapBackendAuctionPurchase = (v: any): AuctionPurchase => ({
  id: v.auction_id?.toString() || v.id?.toString(),
  make: v.make || '',
  model: v.model || '',
  year: parseInt(v.year) || 0,
  mileage: parseInt(v.mileage) || 0,
  vin: v.vin || '',
  exterior_color: v.exterior_color || '',
  interior_color: v.interior_color || '',
  transmission: v.transmission || '',
  body_type: v.body_type || '',
  description: v.description || '',
  status: v.status || '',
  condition: v.condition || '',
  fuel_type: v.fuel_type || '',
  tags: Array.isArray(v.tags) ? v.tags : [],
  carfax_link: v.carfax_link || '',
  purchase_price: parseFloat(v.purchase_price) || 0,
  purchase_date: v.purchase_date || '',
  additional_costs: parseFloat(v.additional_costs || 0),
  list_price: parseFloat(v.list_price || 0),
  sold_price: parseFloat(v.sold_price || 0),
  notes: v.notes || '',
  images: Array.isArray(v.images) ? v.images : [],
  created_at: v.created_at || '',
  updated_at: v.updated_at || '',
});

export const addAuctionPurchase = async (purchaseData: FormData): Promise<AddAuctionPurchaseResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.ADD_AUCTION_PURCHASE, purchaseData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    console.log('Backend response:', response.data);
    
    if (response.data.success === true) {
      return { success: true, purchase: response.data.data ? mapBackendAuctionPurchase(response.data.data) : undefined };
    } else {
      return { success: false, error: response.data.message || 'Failed to add auction purchase' };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to add auction purchase'
    };
  }
};

export const getAuctionPurchases = async (filters?: Record<string, any>): Promise<GetAuctionPurchasesResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.FETCH_AUCTION_PURCHASES, { params: filters });
    
    console.log('Get auction purchases response:', response.data);
    
    if (response.data.status === 'success' && response.data.data) {
      const vehicles = Array.isArray(response.data.data.vehicles) 
        ? response.data.data.vehicles.map(mapBackendAuctionPurchase)
        : [];
      
      console.log('Mapped vehicles:', vehicles);
      
      return { 
        success: true, 
        purchases: vehicles,
        pagination: response.data.data.pagination
      };
    } else {
      return {
        success: false,
        error: response.data.message || 'Failed to fetch auction purchases'
      };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to fetch auction purchases'
    };
  }
};

export const getAuctionDashboard = async (): Promise<AuctionDashboardResponse> => {
  try {
    const response = await api.get(API_ENDPOINTS.AUCTION_DASHBOARD);
    
    if (response.data.status === 'success') {
      return { success: true, data: response.data.data };
    } else {
      return {
        success: false,
        error: response.data.message || 'Failed to fetch auction dashboard'
      };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to fetch auction dashboard'
    };
  }
};

export const updateAuctionPurchase = async (auctionId: string, purchaseData: FormData): Promise<AddAuctionPurchaseResponse> => {
  try {
    const response = await api.put(API_ENDPOINTS.UPDATE_AUCTION_PURCHASE(auctionId), purchaseData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data.status === 'success') {
      return { success: true, purchase: mapBackendAuctionPurchase(response.data.data) };
    } else {
      return { success: false, error: response.data.message || 'Failed to update auction purchase' };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to update auction purchase'
    };
  }
};

export const deleteAuctionPurchase = async (auctionId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await api.delete(API_ENDPOINTS.DELETE_AUCTION_PURCHASE(auctionId));
    
    if (response.data.status === 'success') {
      return { success: true };
    } else {
      return { success: false, error: response.data.message || 'Failed to delete auction purchase' };
    }
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || axiosError.response?.data?.error || 'Failed to delete auction purchase'
    };
  }
};