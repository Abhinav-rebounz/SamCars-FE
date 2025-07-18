import { ArrowLeft, Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import VehicleActions from '../../components/vehicle/VehicleActions';
import VehicleImageGallery from '../../components/vehicle/VehicleImageGallery';
import { getVehicleById } from '../../services/vehicle';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: number;
  exterior_color: string;
  interior_color: string;
  transmission: string;
  fuel_type: string;
  engine: string;
  body_type: string;
  vin: string;
  condition: string;
  status: string;
  description: string;
  featured: boolean;
  carfax_link: string;
  available: boolean;
  images: string[];
  features: string[];
  tags: string[];
  stock_number?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTestDriveForm, setShowTestDriveForm] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveTime, setTestDriveTime] = useState('');
  const [testDriveSubmitted, setTestDriveSubmitted] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) {
        setError('Vehicle not found');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await getVehicleById(id);
        if (response.success && response.vehicle) {
          setVehicle(response.vehicle as unknown as Vehicle);
        } else {
          setError(response.error || 'Failed to fetch vehicle details');
        }
      } catch (err) {
        setError('Failed to fetch vehicle details');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const nextImage = () => {
    if (!vehicle?.images) return;
    const imagesLength = vehicle.images.length;
    setCurrentImageIndex((prev) => 
      prev === imagesLength - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    if (!vehicle?.images) return;
    const imagesLength = vehicle.images.length;
    setCurrentImageIndex((prev) => 
      prev === 0 ? imagesLength - 1 : prev - 1
    );
  };
  
  const handleTestDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTestDriveSubmitted(true);
    setTimeout(() => {
      setShowTestDriveForm(false);
      setTestDriveSubmitted(false);
    }, 3000);
  };
  
  const handleAddToWishlist = () => {
    alert('Vehicle added to wishlist!');
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        text: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} at Sam Cars!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Share URL copied to clipboard!');
    }
  };

  const handleHoldVehicle = async () => {
    if (!vehicle) return;

    if (!isAuthenticated || !user) {
      alert('Please log in to hold this vehicle.');
      return;
    }
  
    try {
      const { data } = await api.post(API_ENDPOINTS.CREATE_CHECKOUT_SESSION, {
        vehicle_id: vehicle.id,
        user_id: user.userId // Changed to match the User type
      });
  
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to initiate payment.');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Error initiating payment.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Vehicle not found'}</p>
          <Link
            to="/inventory"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(vehicle.price);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/inventory" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Inventory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery Section */}
            {vehicle && (
              <VehicleImageGallery
                images={vehicle?.images || []}
                make={vehicle?.make || ''}
                model={vehicle?.model || ''}
              />
            )}

            {/* Basic Vehicle Details Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-l-4 border-blue-600 pl-4 py-4 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {vehicle && `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                </h2>
              </div>
              <div className="p-6">
                <dl className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Stock Number</dt>
                    <dd className="text-sm font-semibold text-gray-900">{vehicle?.stock_number}</dd>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="text-sm font-semibold text-gray-900">{vehicle?.location}</dd>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Mileage</dt>
                    <dd className="text-sm font-semibold text-gray-900">{vehicle?.mileage.toLocaleString()} miles</dd>
                  </div>
                  {vehicle?.created_at && (
                    <div className="flex justify-between items-center py-2">
                      <dt className="text-sm font-medium text-gray-500">Listed On</dt>
                      <dd className="text-sm font-semibold text-gray-900">
                        {new Date(vehicle.created_at).toLocaleDateString()}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Technical Details Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-l-4 border-blue-600 pl-4 py-4">
                <h2 className="text-xl font-semibold text-gray-900">Technical Details</h2>
              </div>
              <div className="p-6">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Transmission</dt>
                    <dd className="text-sm font-semibold text-gray-900">{vehicle?.transmission}</dd>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
                    <dd className="text-sm font-semibold text-gray-900">{vehicle?.fuel_type}</dd>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Exterior Color</dt>
                    <dd className="text-sm font-semibold text-gray-900">{vehicle?.exterior_color}</dd>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <dt className="text-sm font-medium text-gray-500">Interior Color</dt>
                    <dd className="text-sm font-semibold text-gray-900">{vehicle?.interior_color}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Description Section */}
            {vehicle?.description && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-l-4 border-blue-600 pl-4 py-4">
                  <h2 className="text-xl font-semibold text-gray-900">Description</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{vehicle.description}</p>
                </div>
              </div>
            )}

            {/* Features Section */}
            {vehicle?.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-l-4 border-blue-600 pl-4 py-4">
                  <h2 className="text-xl font-semibold text-gray-900">Features</h2>
                </div>
                <div className="p-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vehicle.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <Check className="w-5 h-5 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Takes up 1 column */}
          <div className="lg:col-span-1">
            {vehicle && (
              <VehicleActions
                vehicleId={vehicle.id}
                price={vehicle.price}
                carfaxLink={vehicle.carfax_link}
                status={vehicle.status}
                available={vehicle.available}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
