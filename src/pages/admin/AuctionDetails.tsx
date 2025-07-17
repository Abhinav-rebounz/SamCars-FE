import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, ExternalLink, Image as ImageIcon, DollarSign, Trash2 } from 'lucide-react';
import { getAuctionById, deleteAuctionPurchase } from '../../services/auction';
import AuctionPurchaseForm from '../../components/auction/AuctionPurchaseForm';

interface AuctionDetails {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  mileage: number;
  exterior_color: string;
  interior_color: string;
  transmission: string;
  fuel_type: string;
  body_type: string;
  engine: string;
  condition: string;
  status: string;
  description: string;
  stock_number: string;
  location: string;
  carfax_link: string;
  purchase_date: string;
  purchase_price: number;
  additional_costs: number;
  total_investment: number;
  list_price: number;
  sold_price: number | null;
  profit: number | null;
  notes: string;
  created_at: string;
  updated_at: string;
  images: string[];
  primary_image_index: number;
  tags: string[];
  features: string[];
}

const AuctionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<AuctionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchAuctionDetails = useCallback(async () => {
    if (!id) {
      setError("Invalid auction ID");
      setLoading(false);
      return;
    }

    // Validate numeric ID
    const numericId = parseInt(id, 10);
    if (isNaN(numericId) || numericId <= 0) {
      setError("Invalid auction ID. Please provide a valid positive numeric ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getAuctionById(id);
      
      if (response.success && response.purchase) {
        const total_investment = response.purchase.purchase_price + (response.purchase.additional_costs || 0);
        const profit = response.purchase.sold_price 
          ? response.purchase.sold_price - total_investment
          : null;

        setAuction({
          ...response.purchase,
          total_investment,
          profit,
          engine: response.purchase.engine || '',
          stock_number: response.purchase.stock_number || '',
          location: response.purchase.location || '',
          primary_image_index: response.purchase.primary_image_index || 0,
          features: response.purchase.features || [],
          tags: response.purchase.tags || [],
          images: response.purchase.images || [],
          notes: response.purchase.notes || '',
          description: response.purchase.description || ''
        });
      } else {
        setError(response.error || "Failed to fetch auction details");
      }
    } catch (err) {
      console.error("Error fetching auction details:", err);
      setError("An error occurred while fetching auction details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAuctionDetails();
  }, [fetchAuctionDetails]);

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set([...prev, index]));
  };

  const handleEditSuccess = async () => {
    try {
      await fetchAuctionDetails();
      setShowEditModal(false);
    } catch (err) {
      console.error("Error refreshing auction details:", err);
      setError("Failed to refresh auction details after edit");
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      const response = await deleteAuctionPurchase(id);
      if (response.success) {
        navigate('/admin/auctions', { 
          state: { message: 'Auction deleted successfully!' }
        });
      } else {
        setError(response.error || 'Failed to delete auction');
      }
    } catch (err) {
      console.error('Error deleting auction:', err);
      setError('An error occurred while deleting the auction');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Update the error display component to show a more user-friendly message
  if (error || !auction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
          <p className="text-red-500 text-center mb-4">{error || "Auction not found"}</p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/admin/auctions')}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Auctions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/admin/auctions')}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Auctions
        </button>
        <div className="flex items-center space-x-4">
          {auction.carfax_link && (
            <a
              href={auction.carfax_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Carfax Report
            </a>
          )}
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this auction? This action cannot be undone.')) {
                handleDelete();
              }
            }}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {auction.images && auction.images.length > 0 ? (
                auction.images.map((url, index) => (
                  !imageErrors.has(index) && (
                    <div key={index} className="relative aspect-w-16 aspect-h-9">
                      <img
                        src={url}
                        alt={`${auction.make} ${auction.model} - Image ${index + 1}`}
                        className="rounded-lg object-cover w-full h-full"
                        onError={() => {
                          console.error(`Failed to load image at index ${index}:`, url);
                          handleImageError(index);
                        }}
                      />
                      {index === auction.primary_image_index && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
                          Primary
                        </div>
                      )}
                    </div>
                  )
                ))
              ) : (
                <div className="col-span-full flex items-center justify-center bg-gray-100 rounded-lg p-8">
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Vehicle Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Basic Information</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Make</dt>
                    <dd className="font-medium">{auction.make}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Model</dt>
                    <dd className="font-medium">{auction.model}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Year</dt>
                    <dd className="font-medium">{auction.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">VIN</dt>
                    <dd className="font-medium">{auction.vin}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Stock Number</dt>
                    <dd className="font-medium">{auction.stock_number}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Location</dt>
                    <dd className="font-medium">{auction.location}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Specifications</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Mileage</dt>
                    <dd className="font-medium">{auction.mileage?.toLocaleString()} mi</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Transmission</dt>
                    <dd className="font-medium">{auction.transmission}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Body Type</dt>
                    <dd className="font-medium">{auction.body_type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Engine</dt>
                    <dd className="font-medium">{auction.engine}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Fuel Type</dt>
                    <dd className="font-medium">{auction.fuel_type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Condition</dt>
                    <dd className="font-medium">{auction.condition}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Colors</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Exterior</dt>
                  <dd className="font-medium">{auction.exterior_color}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Interior</dt>
                  <dd className="font-medium">{auction.interior_color}</dd>
                </div>
              </dl>
            </div>

            {auction.description && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{auction.description}</p>
              </div>
            )}

            {auction.carfax_link && (
              <div className="mt-6">
                <a
                  href={auction.carfax_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Carfax Report
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Auction Details */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Auction Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    auction.status === 'available' ? 'bg-green-100 text-green-800' :
                    auction.status === 'sold' ? 'bg-red-100 text-red-800' :
                    auction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    auction.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-gray-500">Purchase Date</dt>
                <dd className="mt-1 font-medium">
                  {new Date(auction.purchase_date).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt className="text-gray-500">Purchase Price</dt>
                <dd className="mt-1 font-medium text-xl flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-1" />
                  {auction.purchase_price.toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-gray-500">Additional Costs</dt>
                <dd className="mt-1 font-medium flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                  {auction.additional_costs.toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-gray-500">Total Investment</dt>
                <dd className="mt-1 font-medium text-lg flex items-center">
                  <DollarSign className="w-5 h-5 text-gray-400 mr-1" />
                  {auction.total_investment.toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-gray-500">List Price</dt>
                <dd className="mt-1 font-medium flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                  {auction.list_price?.toLocaleString() || 'Not set'}
                </dd>
              </div>

              {auction.sold_price && (
                <div>
                  <dt className="text-gray-500">Sold Price</dt>
                  <dd className="mt-1 font-medium flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    {auction.sold_price.toLocaleString()}
                  </dd>
                </div>
              )}

              {auction.profit !== null && (
                <div>
                  <dt className="text-gray-500">Profit</dt>
                  <dd className={`mt-1 font-medium flex items-center ${
                    auction.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <DollarSign className="w-4 h-4 mr-1" />
                    {Math.abs(auction.profit).toLocaleString()}
                    {auction.profit < 0 && ' (Loss)'}
                  </dd>
                </div>
              )}
            </dl>

            {auction.notes && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Notes</h3>
                <p className="text-gray-700 whitespace-pre-line">{auction.notes}</p>
              </div>
            )}
          </div>

          {/* Features and Tags */}
          <div className="bg-white rounded-lg shadow-md p-6">
            {auction.features && auction.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {auction.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {auction.tags && auction.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {auction.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Edit Auction</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <AuctionPurchaseForm
                initialData={auction}
                onSuccess={handleEditSuccess}
                onCancel={() => setShowEditModal(false)}
                isEditing={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetails; 