import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { getVehicleById } from '../../services/inventory';
import { Vehicle } from '../../types/vehicle';
import AddVehicleForm from '../../components/inventory/AddVehicleForm';

const VehicleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchVehicle = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await getVehicleById(id);
      console.log('Vehicle details response:', response);
      if (response.success && response.data) {
        console.log('Vehicle data:', response.data);
        console.log('Vehicle stock_number:', response.data.stock_number);
        console.log('Vehicle location:', response.data.location);
        console.log('Vehicle images:', response.data?.images);
        setVehicle(response.data);
      } else {
        setError(response.error || 'Failed to fetch vehicle details');
      }
    } catch (err) {
      console.error('Error fetching vehicle:', err);
      setError('An error occurred while fetching vehicle details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditComplete = () => {
    setShowEditModal(false);
    setSuccessMessage('Vehicle updated successfully!');
    // Refresh vehicle data
    if (id) {
      fetchVehicle();
    }
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleBack = () => {
    navigate('/admin/inventory');
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
          <button
            onClick={handleBack}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded flex justify-between items-center">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-600 hover:text-green-800 font-bold text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.make} {vehicle.model} {vehicle.year}
              </h1>
              <p className="text-gray-600 mt-2">VIN: {vehicle.vin || 'N/A'}</p>
              {vehicle.stock_number && (
                <p className="text-gray-600">Stock #: {vehicle.stock_number}</p>
              )}
            </div>
            
            <div className="flex space-x-3">
              {vehicle.carfax_link && (
                <button
                  onClick={() => window.open(vehicle.carfax_link, '_blank')}
                  className="flex items-center bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Carfax
                </button>
              )}
              <button
                onClick={handleEdit}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Vehicle
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
            {vehicle.images && vehicle.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {vehicle.images.map((image, index) => (
                  <div key={index} className="relative">
                    {!imageErrors.has(index) ? (
                      <img
                        src={image}
                        alt={`${vehicle.make} ${vehicle.model} - Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={() => handleImageError(index)}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* Vehicle Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Details</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Make</dt>
                    <dd className="text-sm text-gray-900">{vehicle.make}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Model</dt>
                    <dd className="text-sm text-gray-900">{vehicle.model}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Year</dt>
                    <dd className="text-sm text-gray-900">{vehicle.year}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                    <dd className="text-sm text-gray-900">${vehicle.price.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Mileage</dt>
                    <dd className="text-sm text-gray-900">
                      {vehicle.mileage ? vehicle.mileage.toLocaleString() : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">VIN</dt>
                    <dd className="text-sm text-gray-900">{vehicle.vin || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Specifications</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Engine</dt>
                    <dd className="text-sm text-gray-900">{vehicle.engine || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Transmission</dt>
                    <dd className="text-sm text-gray-900">{vehicle.transmission || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Body Type</dt>
                    <dd className="text-sm text-gray-900">{vehicle.body_type || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
                    <dd className="text-sm text-gray-900">{vehicle.fuel_type || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Condition</dt>
                    <dd className="text-sm text-gray-900">{vehicle.condition || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'sold' ? 'bg-red-100 text-red-800' :
                        vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Colors and Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Colors & Location</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Exterior Color</dt>
                <dd className="text-sm text-gray-900">{vehicle.exterior_color || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Interior Color</dt>
                <dd className="text-sm text-gray-900">{vehicle.interior_color || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="text-sm text-gray-900">{vehicle.location || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Stock Number</dt>
                <dd className="text-sm text-gray-900">{vehicle.stock_number || 'N/A'}</dd>
              </div>
            </dl>
          </div>

          {/* Features and Tags */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features & Tags</h2>
            
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {vehicle.tags && vehicle.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {vehicle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(!vehicle.features || vehicle.features.length === 0) && 
             (!vehicle.tags || vehicle.tags.length === 0) && (
              <p className="text-gray-500 text-sm">No features or tags available</p>
            )}
          </div>
        </div>

        {/* Description */}
        {vehicle.description && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{vehicle.description}</p>
          </div>
        )}

        {/* Edit Vehicle Modal */}
        {showEditModal && vehicle && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                  <button
                    className="absolute top-4 right-4 text-gray-700 hover:text-red-600 bg-white rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                    onClick={() => setShowEditModal(false)}
                    aria-label="Close Edit Vehicle Form"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Edit className="h-6 w-6 text-blue-700" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        Edit Vehicle
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Update the vehicle information below.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-4">
                    <AddVehicleForm
                      initialData={vehicle}
                      onSuccess={handleEditComplete}
                      onCancel={() => setShowEditModal(false)}
                      isEditing={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails; 