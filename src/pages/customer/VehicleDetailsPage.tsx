import { loadStripe } from '@stripe/stripe-js';
import {
  ArrowLeft,
  Calendar,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Cog,
  FileText,
  Fuel,
  Gauge,
  Heart,
  Share
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, API_ENDPOINTS } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { getVehicleById } from '../../services/vehicle';

const stripePromise = loadStripe('your-publishable-key-here');

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
}

const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showTestDriveForm, setShowTestDriveForm] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveTime, setTestDriveTime] = useState('');
  const [testDriveSubmitted, setTestDriveSubmitted] = useState(false);

  // --- Zoom state ---
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;  // percentage
    const y = ((e.clientY - top) / height) * 100;  // percentage
    setCursorPos({ x, y });
  };

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
  
  if (loading) {
    return <div className="container-custom py-16 text-center">Loading vehicle details...</div>;
  }
  
  if (error || !vehicle) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="heading-lg mb-4">Vehicle Not Found</h1>
        <p className="text-gray-600 mb-8">{error || "The vehicle you're looking for doesn't exist or has been removed."}</p>
        <Link to="/inventory" className="btn-primary">
          Back to Inventory
        </Link>
      </div>
    );
  }
  
  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === vehicle.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrevImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? vehicle.images.length - 1 : prevIndex - 1
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
  
    try {
      const { data } = await api.post(API_ENDPOINTS.CREATE_CHECKOUT_SESSION, {
        vehicle_id: vehicle.id,
        user_id: null // TODO: get user id from auth context
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

  const price = parseFloat(vehicle.price);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-blue-700">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link to="/inventory" className="text-gray-500 hover:text-blue-700">Inventory</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-700">{vehicle.year} {vehicle.make} {vehicle.model}</span>
          </div>
        </div>
      </div>
      
      <div className="container-custom pt-8">
        {/* Back Button */}
        <Link to="/inventory" className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Inventory
        </Link>
        
        {/* Vehicle Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="heading-lg mb-2 md:mb-0">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleAddToWishlist}
              className="text-gray-700 hover:text-red-500 flex items-center"
            >
              <Heart className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Wishlist</span>
            </button>
            <button 
              onClick={handleShare}
              className="text-gray-700 hover:text-blue-700 flex items-center"
            >
              <Share className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {/* Main Image with Zoom */}
              <div
                className="relative overflow-hidden"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                style={{ height: '384px' }} // h-96 = 24rem = 384px
              >
                <img
                  src={vehicle.images[activeImageIndex]}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-contain transition-transform duration-300 ease-out"
                  style={{
                    transformOrigin: `${cursorPos.x}% ${cursorPos.y}%`,
                    transform: isZoomed ? 'scale(2)' : 'scale(1)',
                    cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                  }}
                />
              </div>
              
              {/* Image Navigation */}
              {vehicle.images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                    style={{ zIndex: 10 }}
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-800" />
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                    style={{ zIndex: 10 }}
                  >
                    <ChevronRight className="h-6 w-6 text-gray-800" />
                  </button>
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded" style={{ zIndex: 10 }}>
                    {activeImageIndex + 1} / {vehicle.images.length}
                  </div>
                </>
              )}
              
              {/* Thumbnail Images */}
              {vehicle.images.length > 1 && (
                <div className="flex p-2 overflow-x-auto">
                  {vehicle.images.map((image: string, index: number) => (
                    <div 
                      key={index}
                      className={`w-24 h-16 flex-shrink-0 mx-1 cursor-pointer ${
                        index === activeImageIndex ? 'ring-2 ring-blue-700' : ''
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Vehicle Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Vehicle Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{vehicle.year}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Gauge className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-medium">{vehicle.mileage.toLocaleString()} miles</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Fuel className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium">{vehicle.fuel_type}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Cog className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-medium">
                      {vehicle.transmission === 'manual' ? 'Manual' : 
                       vehicle.transmission === 'automatic' ? 'Automatic' : 
                       vehicle.transmission}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Car className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Body Type</p>
                    <p className="font-medium">{vehicle.body_type}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="font-medium">{vehicle.vin}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 text-blue-700 mt-0.5 mr-2 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: vehicle.exterior_color }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Exterior Color</p>
                    <p className="font-medium">{vehicle.exterior_color}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 text-blue-700 mt-0.5 mr-2 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: vehicle.interior_color }} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interior Color</p>
                    <p className="font-medium">{vehicle.interior_color}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-5 w-5 text-blue-700 mt-0.5 mr-2 flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-medium capitalize">{vehicle.condition}</p>
                  </div>
                </div>
                {vehicle.engine && (
                  <div className="flex items-start">
                    <Cog className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Engine</p>
                      <p className="font-medium">{vehicle.engine}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 mb-4">
                  {vehicle.description || 'No description available for this vehicle.'}
                </p>
                
                {vehicle.features.length > 0 && (
                  <>
                    <h3 className="font-semibold mb-2">Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {vehicle.features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <Check className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Price and Actions */}
          <div>
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-700">
                  ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                {vehicle.tags.includes('New Arrival') && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    New Arrival
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setShowTestDriveForm(!showTestDriveForm)}
                  className="btn-primary w-full"
                >
                  Book Test Drive
                </button>
                
                <button 
                  onClick={handleHoldVehicle}
                  className="btn-secondary w-full"
                >
                  Make a Payment to Hold
                </button>
                
                {vehicle.carfax_link && (
                  <a 
                    href={vehicle.carfax_link} 
                    className="btn-outline w-full block text-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View CARFAX Report
                  </a>
                )}
              </div>
              
              {/* Test Drive Form */}
              {showTestDriveForm && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="font-semibold mb-4">Schedule Test Drive</h3>
                  
                  {testDriveSubmitted ? (
                    <div className="bg-green-50 text-green-700 p-3 rounded">
                      Test drive scheduled successfully! We'll contact you to confirm.
                    </div>
                  ) : (
                    <form onSubmit={handleTestDriveSubmit}>
                      {!isAuthenticated && (
                        <p className="mb-3 text-red-600 text-sm">Please login to schedule a test drive.</p>
                      )}
                      
                      <label className="block mb-2 font-medium" htmlFor="date">
                        Date
                      </label>
                      <input 
                        type="date"
                        id="date"
                        value={testDriveDate}
                        onChange={e => setTestDriveDate(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded p-2 mb-4"
                        disabled={!isAuthenticated}
                      />
                      
                      <label className="block mb-2 font-medium" htmlFor="time">
                        Time
                      </label>
                      <input 
                        type="time"
                        id="time"
                        value={testDriveTime}
                        onChange={e => setTestDriveTime(e.target.value)}
                        required
                        className="w-full border border-gray-300 rounded p-2 mb-4"
                        disabled={!isAuthenticated}
                      />
                      
                      <button 
                        type="submit"
                        className="btn-primary w-full"
                        disabled={!isAuthenticated}
                      >
                        Submit
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
