import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getWishlist, WishlistVehicle } from '../../services/wishlist';
import Alert from '../../components/Alert';

const WishlistPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getWishlist();
        if (response.success && response.vehicles) {
          setWishlistItems(response.vehicles);
        } else {
          setError(response.message || 'Failed to fetch wishlist');
        }
      } catch (err) {
        setError('Failed to fetch wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);
  
  const [showComingSoon, setShowComingSoon] = useState(false);
  const handleRemoveFromWishlist = async (id: number) => {
    setShowComingSoon(true);
  };

  // Always show coming soon message in the page (not as an alert)
  const comingSoonBanner = (
    <div className="flex flex-col items-center justify-center py-16">
      <Heart className="h-12 w-12 text-blue-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Wishlist Feature Coming Soon</h2>
      <p className="text-gray-600 text-lg max-w-xl text-center">
        You will be able to save and manage your favorite vehicles in a future update. Stay tuned!
      </p>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center mb-8">
          <Heart className="h-6 w-6 text-red-500 mr-2" />
          <h1 className="heading-lg">My Wishlist</h1>
        </div>
        {comingSoonBanner}
      </div>
    </div>
  );
};

export default WishlistPage;