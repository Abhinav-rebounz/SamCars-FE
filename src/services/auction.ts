import api from './api';
import { API_ENDPOINTS } from '../config/api';
import { AxiosError } from 'axios';

interface AuctionPurchase {
  id: string;
  vehicleId: string;
  purchasePrice: number;
  purchaseDate: string;
  images: string[];
  status: string;
  description: string;
}

interface ErrorResponse {
  message: string;
}

interface AddAuctionPurchaseResponse {
  success: boolean;
  purchase?: AuctionPurchase;
  error?: string;
}

export const addAuctionPurchase = async (purchaseData: FormData): Promise<AddAuctionPurchaseResponse> => {
  try {
    const response = await api.post(API_ENDPOINTS.ADD_AUCTION_PURCHASE, purchaseData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return { success: true, purchase: response.data };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      error: axiosError.response?.data?.message || 'Failed to add auction purchase'
    };
  }
}; 