import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getVehicleById } from '../../services/vehicle';
import { Vehicle } from '../../types/vehicle';

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getVehicleById(id);
        
        if (response.success && response.vehicle) {
          setVehicle(response.vehicle);
        } else {
          setError(response.error || 'Failed to fetch vehicle details');
        }
      } catch (err) {
        setError('An error occurred while fetching vehicle details');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!vehicle) return <div className="text-gray-500 p-4">Vehicle not found</div>;

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h1>

        {/* Image Gallery */}
        <div className="relative mb-8">
          {vehicle.images && vehicle.images.length > 0 ? (
            <>
              <img
                src={vehicle.images[currentImageIndex]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-96 object-cover rounded-lg"
              />
              {vehicle.images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    →
                  </button>
                </>
              )}
              <div className="flex justify-center mt-4 space-x-2">
                {vehicle.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              No images available
            </div>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Vehicle Information</h2>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Price:</span>
                <span className="ml-2 text-green-600">${vehicle.price.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium">Mileage:</span>
                <span className="ml-2">{vehicle.mileage.toLocaleString()} miles</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2">{vehicle.status}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{vehicle.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Contact Seller
          </button>
          <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Schedule Test Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails; 