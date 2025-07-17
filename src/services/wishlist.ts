import { api, API_ENDPOINTS } from '../config/api';

export interface WishlistVehicle {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    exterior_color: string;
    interior_color: string;
    transmission: string;
    fuel_type: string;
    body_type: string;
    vin: string;
    condition: string;
    status: string;
    description: string;
    images: string[];
    tags: string[];
    features: string[];
    added_to_wishlist_at: string;
}

export interface WishlistResponse {
    status: 'success' | 'error';
    data?: WishlistVehicle[];
    message?: string;
}

export interface WishlistCheckResponse {
    status: 'success' | 'error';
    data?: { isInWishlist: boolean };
    message?: string;
}

/**
 * Get user's wishlist
 */
export const getWishlist = async (): Promise<WishlistResponse> => {
    try {
        const response = await api.get(API_ENDPOINTS.FETCH_WISHLIST);
        return response.data;
    } catch (error: any) {
        console.error('Error fetching wishlist:', error);
        return {
            status: 'error',
            message: error.response?.data?.message || 'Failed to fetch wishlist'
        };
    }
};

/**
 * Add vehicle to wishlist
 * @param vehicleId - Vehicle ID to add
 */
export const addToWishlist = async (vehicleId: number): Promise<WishlistResponse> => {
    try {
        const response = await api.post(API_ENDPOINTS.ADD_TO_WISHLIST, { vehicle_id: vehicleId });
        return response.data;
    } catch (error: any) {
        console.error('Error adding to wishlist:', error);
        return {
            status: 'error',
            message: error.response?.data?.message || 'Failed to add to wishlist'
        };
    }
};

/**
 * Remove vehicle from wishlist
 * @param vehicleId - Vehicle ID to remove
 */
export const removeFromWishlist = async (vehicleId: number): Promise<WishlistResponse> => {
    try {
        const response = await api.delete(API_ENDPOINTS.REMOVE_FROM_WISHLIST(vehicleId));
        return response.data;
    } catch (error: any) {
        console.error('Error removing from wishlist:', error);
        return {
            status: 'error',
            message: error.response?.data?.message || 'Failed to remove from wishlist'
        };
    }
};

/**
 * Check if vehicle is in wishlist
 * @param vehicleId - Vehicle ID to check
 */
export const checkWishlist = async (vehicleId: number): Promise<WishlistCheckResponse> => {
    try {
        const response = await api.get(API_ENDPOINTS.CHECK_WISHLIST(vehicleId));
        return response.data;
    } catch (error: any) {
        console.error('Error checking wishlist:', error);
        return {
            status: 'error',
            message: error.response?.data?.message || 'Failed to check wishlist status'
        };
    }
}; 