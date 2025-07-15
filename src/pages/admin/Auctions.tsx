import React, { useState, useEffect } from 'react';
import { 
  Gavel, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import AuctionPurchaseForm from '../../components/auction/AuctionPurchaseForm';
import { getAuctionPurchases, deleteAuctionPurchase, updateAuctionPurchase } from '../../services/auction';

const Auctions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<any | null>(null);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [imageIndex, setImageIndex] = useState(0);
  
  // Fetch auction vehicles from backend
  const fetchAuctions = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const params = {
        limit: 20,
        page: 1,
        sort_by: 'purchase_date',
        sort_order: 'desc',
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
      };
      
      const response = await getAuctionPurchases(params);
      console.log('Auction API response:', response);
      if (response.success && response.purchases) {
        setAuctions(response.purchases);
      } else {
        setAuctions([]);
        setError('Failed to fetch auction purchases.');
      }
    } catch (err) {
      console.error('Error fetching auctions:', err);
      setError('An error occurred while fetching auction purchases.');
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [searchTerm, filterStatus]);
  
  // Filter auctions based on search term and filters
  const filteredAuctions = auctions.filter(auction => {
    const searchString = `${auction.make} ${auction.model} ${auction.vin}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || (auction.status && auction.status.toLowerCase() === filterStatus.toLowerCase());
    return matchesSearch && matchesStatus;
  });
  
  // Sort auctions
  const sortedAuctions = [...filteredAuctions].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    // Handle date strings
    if (sortField === 'created_at' || sortField === 'updated_at' || sortField === 'purchase_date') {
      aValue = new Date(aValue || '1970-01-01').getTime();
      bValue = new Date(bValue || '1970-01-01').getTime();
    }
    
    // Handle numeric values
    if ([
      'purchase_price', 'list_price', 'sold_price', 'year'
    ].includes(sortField)) {
      aValue = parseFloat(aValue?.toString() || '0');
      bValue = parseFloat(bValue?.toString() || '0');
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleViewAuction = (auction: any) => {
    setSelectedAuction(auction);
    setShowDetailModal(true);
  };

  const handleEditAuction = (auction: any) => {
    setSelectedAuction(auction);
    setShowEditModal(true);
  };

  const handleDeleteAuction = async (auctionId: string) => {
    if (!confirm('Are you sure you want to delete this auction purchase? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(auctionId);
    try {
      const response = await deleteAuctionPurchase(auctionId);
      if (response.success) {
        // Remove the deleted auction from the list
        setAuctions(prev => prev.filter(auction => auction.id !== auctionId));
      } else {
        alert('Failed to delete auction purchase: ' + response.error);
      }
    } catch (error) {
      console.error('Error deleting auction:', error);
      alert('An error occurred while deleting the auction purchase');
    } finally {
      setDeleteLoading(null);
    }
  };
  
  const calculateTotalInvestment = (purchase: number, additional: number) => {
    return purchase + additional;
  };
  
  const calculateProfit = (soldPrice: number | null, totalInvestment: number) => {
    return soldPrice ? soldPrice - totalInvestment : 0;
  };

  const handleImageError = (auctionId: string) => {
    setImageErrors(prev => ({ ...prev, [auctionId]: true }));
  };

  // Handler for cancel button in modal
  const handleCancel = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedAuction(null);
    fetchAuctions(); // Refresh list after add/edit
  };

  // Handler for successful add/edit
  const handleAuctionSuccess = (msg: string) => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedAuction(null);
    setError(null);
    setSuccessMessage(msg);
    fetchAuctions();
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handler for save button in modal (trigger form submit via ref)
  const formRef = React.useRef<HTMLFormElement>(null);
  const handleSave = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  useEffect(() => {
    setImageIndex(0);
  }, [selectedAuction]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Auction to Sale Tracker</h1>
        <div className="flex w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Auction Purchase
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && !error && (
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

      {/* Modal for Add Auction Purchase */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-auto p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-red-600 bg-white rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
              onClick={handleCancel}
              aria-label="Close Add Auction Purchase Form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-6 text-center">Add Auction Purchase</h2>
            <AuctionPurchaseForm 
              formRef={formRef}
              onSuccess={() => handleAuctionSuccess('Auction purchase added successfully!')}
            />
          </div>
        </div>
      )}

      {/* Modal for Edit Auction Purchase */}
      {showEditModal && selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl mx-auto p-6 relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-red-600 bg-white rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
              onClick={handleCancel}
              aria-label="Close Edit Auction Purchase Form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-semibold mb-6 text-center">Edit Auction Purchase</h2>
            <AuctionPurchaseForm 
              formRef={formRef}
              onSuccess={() => handleAuctionSuccess('Auction purchase updated successfully!')}
              initialData={selectedAuction}
            />
          </div>
        </div>
      )}

      {/* Modal for Auction Details */}
      {showDetailModal && selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-red-600 bg-white rounded-full p-1 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
              onClick={() => { setShowDetailModal(false); setSelectedAuction(null); }}
              aria-label="Close Auction Details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Auction Purchase Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Images - Slideshow */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Images</h3>
                {selectedAuction.images && selectedAuction.images.length > 0 ? (
                  <div className="relative w-full h-48 flex items-center justify-center">
                    <img
                      src={selectedAuction.images[imageIndex]}
                      alt={`Auction Image ${imageIndex + 1}`}
                      className="w-full h-48 object-cover rounded border"
                    />
                    {/* Download Button */}
                    <a
                      href={selectedAuction.images[imageIndex]}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-700 p-2 rounded-full shadow z-20"
                      title="Download Image"
                      onClick={e => e.stopPropagation()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                      </svg>
                    </a>
                    {/* Left Arrow */}
                    {selectedAuction.images.length > 1 && (
                      <button
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
                        onClick={() => setImageIndex((prev) => prev === 0 ? selectedAuction.images.length - 1 : prev - 1)}
                        aria-label="Previous Image"
                      >
                        &#8592;
                      </button>
                    )}
                    {/* Right Arrow */}
                    {selectedAuction.images.length > 1 && (
                      <button
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
                        onClick={() => setImageIndex((prev) => prev === selectedAuction.images.length - 1 ? 0 : prev + 1)}
                        aria-label="Next Image"
                      >
                        &#8594;
                      </button>
                    )}
                    {/* Image Counter */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {imageIndex + 1} / {selectedAuction.images.length}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No images available</div>
                )}
              </div>
              {/* Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 border-b pb-2">Details</h3>
                <dl className="divide-y divide-gray-200">
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">Make</dt>
                    <dd className="text-gray-900">{selectedAuction.make}</dd>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">Model</dt>
                    <dd className="text-gray-900">{selectedAuction.model}</dd>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">Year</dt>
                    <dd className="text-gray-900">{selectedAuction.year}</dd>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">VIN</dt>
                    <dd className="text-gray-900">{selectedAuction.vin}</dd>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">Mileage</dt>
                    <dd className="text-gray-900">{selectedAuction.mileage?.toLocaleString?.() ?? '-'}</dd>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">Purchase Price</dt>
                    <dd className="text-gray-900">${selectedAuction.purchase_price?.toFixed(2) || '-'}</dd>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">Purchase Date</dt>
                    <dd className="text-gray-900">{selectedAuction.purchase_date ? new Date(selectedAuction.purchase_date).toLocaleDateString() : '-'}</dd>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">List Price</dt>
                    <dd className="text-gray-900">${selectedAuction.list_price?.toFixed(2) || '-'}</dd>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">Sold Price</dt>
                    <dd className="text-gray-900">${selectedAuction.sold_price?.toFixed(2) || '-'}</dd>
                  </div>
                  <div className="py-2 flex justify-between items-center">
                    <dt className="font-medium text-gray-500">Status</dt>
                    <dd className="text-gray-900 capitalize">{selectedAuction.status}</dd>
                  </div>
                  {/* Add more fields as needed */}
                </dl>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  setShowDetailModal(false);
                  setShowEditModal(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this auction purchase? This action cannot be undone.')) {
                    await handleDeleteAuction(selectedAuction.id);
                    setShowDetailModal(false);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by make, model, or VIN"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="auction">Auction</option>
                <option value="listed">Listed</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auctions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('make')}>
                <div className="flex items-center">
                  Make
                  {sortField === 'make' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('model')}>
                <div className="flex items-center">
                  Model
                  {sortField === 'model' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('year')}>
                <div className="flex items-center">
                  Year
                  {sortField === 'year' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mileage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('vin')}>
                <div className="flex items-center">
                  VIN
                  {sortField === 'vin' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('purchase_price')}>
                <div className="flex items-center">
                  Purchase Price
                  {sortField === 'purchase_price' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('purchase_date')}>
                <div className="flex items-center">
                  Purchase Date
                  {sortField === 'purchase_date' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('list_price')}>
                <div className="flex items-center">
                  List Price
                  {sortField === 'list_price' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('sold_price')}>
                <div className="flex items-center">
                  Sold Price
                  {sortField === 'sold_price' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                <div className="flex items-center">
                  Status
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse flex space-x-4 p-4 bg-gray-100 rounded">
                    <div className="rounded bg-gray-300 h-16 w-16" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-6 bg-gray-300 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
              </div>
            )}
            {!loading && !error && sortedAuctions.length === 0 && (
              <tr><td colSpan={11} className="text-center py-4">No auction purchases found.</td></tr>
            )}
            {!loading && !error && sortedAuctions.length > 0 && (
              sortedAuctions.map((auction, idx) => (
                <tr key={auction.id || idx} className="hover:bg-gray-50 cursor-pointer" onClick={() => { setSelectedAuction(auction); setShowDetailModal(true); }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-10 w-10">
                      {auction.images && auction.images.length > 0 && !imageErrors[auction.id] ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={auction.images[0]}
                          alt={`${auction.make} ${auction.model}`}
                          onError={() => handleImageError(auction.id)}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{auction.make}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.mileage?.toLocaleString?.() ?? '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.vin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${auction.purchase_price?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {auction.purchase_date ? new Date(auction.purchase_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${auction.list_price?.toFixed(2) || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${auction.sold_price?.toFixed(2) || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      auction.status === 'sold' ? 'bg-green-100 text-green-800' :
                      auction.status === 'listed' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditAuction(auction)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAuction(auction.id)}
                        disabled={deleteLoading === auction.id}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                        title="Delete"
                      >
                        {deleteLoading === auction.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Auctions;