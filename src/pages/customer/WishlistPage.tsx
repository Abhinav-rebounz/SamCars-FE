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
        if (response.status === 'success' && response.data) {
          setWishlistItems(response.data);
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
      const response = await removeFromWishlist(id);
      if (response.status === 'success') {
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
          <div className="text-center py-10">Loading...</div>
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
          <div className="text-center py-10 text-red-500">{error}</div>
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
                              className={`tag ${
                                tag === 'new' 
                                  ? 'tag-new' 
                                  : tag === 'featured' 
                                  ? 'tag-featured' 
                                  : 'tag-price-drop'
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
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600 text-sm">Price</p>
                        <p className="font-semibold text-blue-700">${vehicle.price.toLocaleString()}</p>
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
                      <Link to={`/inventory/${vehicle.id}`} className="btn-primary">
                        View Details
                      </Link>
                      <Link to={`/inventory/${vehicle.id}`} className="btn-outline">
                        Book Test Drive
                      </Link>
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
            <Link to="/inventory" className="btn-primary">
              Browse Inventory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;