import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Gauge, 
  Fuel, 
  Cog, 
  Car, 
  Check, 
  FileText, 
  Heart, 
  Share, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getVehicleById } from '../../data/vehicles';
import { useAuth } from '../../contexts/AuthContext';

const VehicleDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const vehicle = getVehicleById(id || '');
  const { isAuthenticated } = useAuth();
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showTestDriveForm, setShowTestDriveForm] = useState(false);
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveTime, setTestDriveTime] = useState('');
  const [testDriveSubmitted, setTestDriveSubmitted] = useState(false);
  
  if (!vehicle) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="heading-lg mb-4">Vehicle Not Found</h1>
        <p className="text-gray-600 mb-8">
          The vehicle you're looking for doesn't exist or has been removed.
        </p>
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
    // In a real app, this would send the data to the server
    setTestDriveSubmitted(true);
    setTimeout(() => {
      setShowTestDriveForm(false);
      setTestDriveSubmitted(false);
    }, 3000);
  };
  
  const handleAddToWishlist = () => {
    // In a real app, this would add the vehicle to the user's wishlist
    alert('Vehicle added to wishlist!');
  };
  
  const handleShare = () => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        text: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} at Sam Cars!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert('Share URL copied to clipboard!');
    }
  };
  
  const handleHoldVehicle = () => {
    // In a real app, this would navigate to a payment page
    alert('Redirecting to payment page...');
  };

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
              {/* Main Image */}
              <div className="relative">
                <img 
                  src={vehicle.images[activeImageIndex]} 
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
                  className="w-full h-96 object-cover"
                />
                
                {/* Image Navigation */}
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
                
                {/* Image Counter */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">
                  {activeImageIndex + 1} / {vehicle.images.length}
                </div>
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex p-2 overflow-x-auto">
                {vehicle.images.map((image, index) => (
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
                    <p className="font-medium">{vehicle.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Cog className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-medium">{vehicle.transmission}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Car className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Body Type</p>
                    <p className="font-medium">{vehicle.bodyType}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">VIN</p>
                    <p className="font-medium">{vehicle.vin}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 mb-4">{vehicle.description}</p>
                
                <h3 className="font-semibold mb-2">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Price and Actions */}
          <div>
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-blue-700">
                  ${vehicle.price.toLocaleString()}
                </h2>
                {vehicle.tags.includes('price-drop') && (
                  <span className="tag tag-price-drop">Price Drop</span>
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
                
                <a 
                  href="#" 
                  className="btn-outline w-full block text-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View CARFAX Report
                </a>
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
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Please <Link to="/login" className="text-blue-700 hover:underline">login</Link> or provide your contact information:
                          </p>
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Full Name"
                              required
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <input
                              type="email"
                              placeholder="Email Address"
                              required
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <input
                              type="tel"
                              placeholder="Phone Number"
                              required
                              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div>
                          <label className="form-label">Preferred Date</label>
                          <input
                            type="date"
                            value={testDriveDate}
                            onChange={(e) => setTestDriveDate(e.target.value)}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                        </div>
                        <div>
                          <label className="form-label">Preferred Time</label>
                          <select
                            value={testDriveTime}
                            onChange={(e) => setTestDriveTime(e.target.value)}
                            required
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          >
                            <option value="">Select a time</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="1:00 PM">1:00 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                          </select>
                        </div>
                        <button type="submit" className="btn-primary w-full">
                          Schedule Test Drive
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
            
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold mb-4">Have Questions?</h3>
              <p className="text-gray-700 mb-4">
                Our team is here to help you with any questions about this vehicle.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">Phone:</span>
                  <a href="tel:5551234567" className="text-blue-700 ml-2">(555) 123-4567</a>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium">Email:</span>
                  <a href="mailto:sales@samcars.com" className="text-blue-700 ml-2">sales@samcars.com</a>
                </div>
              </div>
              <Link to="/contact" className="btn-outline w-full block text-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;