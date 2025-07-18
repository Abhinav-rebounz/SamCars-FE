import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getWishlist, removeFromWishlist, WishlistVehicle } from '../../services/wishlist';

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
  
  const handleRemoveFromWishlist = async (id: number) => {
    try {
      const response = await removeFromWishlist(id.toString());
      if (response.success) {
        setWishlistItems(prev => prev.filter(item => item.id !== id));
      } else {
        alert(response.message || 'Failed to remove from wishlist');
      }
    } catch (err) {
      alert('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-8">
          <div className="flex items-center mb-8">
            <Heart className="h-6 w-6 text-red-500 mr-2" />
            <h1 className="heading-lg">My Wishlist</h1>
          </div>
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="container-custom py-8">
          <div className="flex items-center mb-8">
            <Heart className="h-6 w-6 text-red-500 mr-2" />
            <h1 className="heading-lg">My Wishlist</h1>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex items-center mb-8">
          <Heart className="h-6 w-6 text-red-500 mr-2" />
          <h1 className="heading-lg">My Wishlist</h1>
        </div>
        
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {wishlistItems.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto">
                    <img 
                      src={vehicle.images[0]} 
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-car.jpg'; // Add a placeholder image
                      }}
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {vehicle.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                tag === 'new' 
                                  ? 'bg-green-100 text-green-800' 
                                  : tag === 'featured' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {tag === 'new' 
                                ? 'New' 
                                : tag === 'featured' 
                                ? 'Featured' 
                                : 'Price Drop'}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveFromWishlist(vehicle.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Price</p>
                        <p className="font-semibold text-blue-700">${parseFloat(vehicle.price).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Mileage</p>
                        <p className="font-semibold">{vehicle.mileage.toLocaleString()} miles</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Exterior Color</p>
                        <p className="font-semibold">{vehicle.exterior_color}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Transmission</p>
                        <p className="font-semibold">{vehicle.transmission}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link 
                        to={`/inventory/${vehicle.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </Link>
                      {vehicle.available && (
                        <Link 
                          to={`/inventory/${vehicle.id}?action=test-drive`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Book Test Drive
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              You haven't added any vehicles to your wishlist yet. Browse our inventory and add your favorite vehicles.
            </p>
            <Link 
              to="/inventory" 
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Inventory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;