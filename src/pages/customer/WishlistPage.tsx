import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const WishlistPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center mb-8">
          <Heart className="h-6 w-6 text-red-500 mr-2" />
          <h1 className="heading-lg">My Wishlist</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Feature Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            The wishlist feature is currently being updated. Please check back later.
          </p>
          <Link to="/services" className="btn-primary">
            View Our Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;