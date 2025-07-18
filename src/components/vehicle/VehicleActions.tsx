import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createCheckoutSession } from '../../services/payments';
import { stripePromise } from '../../config/stripe';

interface VehicleActionsProps {
  vehicleId: string;
  price: number;
  isAvailable?: boolean;
}

const VehicleActions: React.FC<VehicleActionsProps> = ({ vehicleId, price, isAvailable = true }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (!isAvailable) {
      setError('This vehicle is not available for purchase.');
      return;
    }

    if (!stripePromise) {
      setError('Payment system is not configured. Please try again later.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const session = await createCheckoutSession(vehicleId);
      if (session.url) {
        window.location.href = session.url;
      } else {
        setError('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <button
        onClick={handlePurchase}
        disabled={loading || !stripePromise || !isAvailable}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
          isAvailable
            ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        {loading ? 'Processing...' : isAvailable ? `Purchase - $${price.toLocaleString()}` : 'Not Available'}
      </button>
      
      <button
        onClick={() => navigate('/contact')}
        className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
      >
        Contact Dealer
      </button>
    </div>
  );
};

export default VehicleActions; 