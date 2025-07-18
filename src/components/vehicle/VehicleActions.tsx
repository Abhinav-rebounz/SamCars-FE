import { Calendar, FileText, Heart, Share } from 'lucide-react';
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { api, API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../Toast';

// Load Stripe with the publishable key from environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface VehicleActionsProps {
  vehicleId: number;
  price: string;
  carfaxLink?: string;
  status: string;
  available: boolean;
}

const VehicleActions: React.FC<VehicleActionsProps> = ({ vehicleId, price, carfaxLink, status, available }) => {
  const { isAuthenticated, user } = useAuth();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const isVehicleAvailable = status === 'available' && available;

  const handleHoldVehicle = async () => {
    if (!isVehicleAvailable) {
      setToast({ message: 'This vehicle is not available for purchase.', type: 'error' });
      return;
    }

    if (!isAuthenticated || !user) {
      setToast({ message: 'Please log in to hold this vehicle.', type: 'info' });
      return;
    }
  
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_CHECKOUT_SESSION, {
        vehicle_id: vehicleId,
        user_id: user.user_id
      });
      
      // Check if we got a URL back from the server
      if (response.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setToast({ message: 'Failed to process payment. Please try again.', type: 'error' });
    }
  };

  const handleScheduleTestDrive = () => {
    if (!isVehicleAvailable) {
      setToast({ message: 'This vehicle is not available for test drive.', type: 'error' });
      return;
    }

    if (!isAuthenticated) {
      setToast({ message: 'Please log in to schedule a test drive.', type: 'info' });
      return;
    }
    // Implement test drive scheduling logic here
    setToast({ message: 'Test drive scheduling will be available soon!', type: 'info' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this vehicle at Saam Cars`,
        text: `I found this great vehicle at Saam Cars!`,
        url: window.location.href,
      }).then(() => {
        setToast({ message: 'Successfully shared!', type: 'success' });
      }).catch((error) => {
        console.error('Error sharing:', error);
        setToast({ message: 'Failed to share. Link copied to clipboard instead.', type: 'info' });
        navigator.clipboard.writeText(window.location.href);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToast({ message: 'Link copied to clipboard!', type: 'success' });
    }
  };

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      setToast({ message: 'Please log in to add to wishlist.', type: 'info' });
      return;
    }
    // Implement wishlist functionality
    setToast({ message: 'Wishlist feature will be available soon!', type: 'info' });
  };

  return (
    <div className="sticky top-4 bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {carfaxLink && (
          <a
            href={carfaxLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-white text-gray-600 p-3 rounded-lg border border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all group"
          >
            <FileText className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Carfax</span>
          </a>
        )}
        <button 
          onClick={handleShare}
          className="flex flex-col items-center justify-center bg-white text-gray-600 p-3 rounded-lg border border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all group"
        >
          <Share className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">Share</span>
        </button>
        <button 
          onClick={handleAddToWishlist}
          className="flex flex-col items-center justify-center bg-white text-gray-600 p-3 rounded-lg border border-gray-200 hover:border-blue-600 hover:text-blue-600 transition-all group"
        >
          <Heart className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">Wishlist</span>
        </button>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Vehicle Price</p>
            <p className="text-2xl font-bold text-gray-900">${price}</p>
            {!isVehicleAvailable && (
              <p className="text-red-600 text-sm font-medium mt-1">
                {status === 'sold' ? 'This vehicle has been sold' : 'This vehicle is not available'}
              </p>
            )}
          </div>

          <button
            onClick={handleHoldVehicle}
            disabled={!isVehicleAvailable}
            className={`w-full py-3 px-4 rounded-lg transition-colors duration-200 ${
              isVehicleAvailable
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isVehicleAvailable ? 'Hold Vehicle' : 'Not Available'}
          </button>

          <button
            onClick={handleScheduleTestDrive}
            disabled={!isVehicleAvailable}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors duration-200 ${
              isVehicleAvailable
                ? 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                : 'bg-gray-100 border-2 border-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Calendar size={20} />
            Schedule Test Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleActions; 