import React, { useState, useEffect } from 'react';
import { getAuctionPurchases } from '../../services/auction';
import AuctionPurchaseForm from '../../components/auction/AuctionPurchaseForm';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Car,
  DollarSign,
  Calendar,
  Tag,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  X,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuctionPurchase {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: string;
  purchase_date: string;
  purchase_price: number;
  list_price: number;
  images?: string[];
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

const AuctionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<AuctionPurchase | null>(null);
  const [auctions, setAuctions] = useState<AuctionPurchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('purchase_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchAuctions = async () => {
    setLoading(true);
    setError(null);
    try {
      const filters = {
        search: searchTerm,
        sort_by: sortField,
        sort_order: sortDirection,
        page: currentPage,
        limit: itemsPerPage,
        ...(filterStatus && { status: filterStatus }),
      };
      const response = await getAuctionPurchases(filters);
      if (response.success && response.purchases) {
        setAuctions(response.purchases);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch auctions');
      }
    } catch (err) {
      setError('An error occurred while fetching auctions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [searchTerm, sortField, sortDirection, currentPage, itemsPerPage, filterStatus]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    setSelectedAuction(null);
    setSuccessMessage('Auction purchase saved successfully!');
    fetchAuctions();
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEditClick = (e: React.MouseEvent, auction: AuctionPurchase) => {
    e.stopPropagation();
    setSelectedAuction(auction);
    setShowModal(true);
  };

  const handleRowClick = (auctionId: string) => {
    navigate(`/admin/auctions/${auctionId}`);
  };

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.total_pages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'sold': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reserved': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Alert Messages at Top of Page */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] max-w-md w-full mx-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-green-800">Success!</h3>
                  <p className="text-xs text-green-700 mt-1">{successMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="flex-shrink-0 ml-4 text-green-600 hover:text-green-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] max-w-md w-full mx-4">
          <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-red-800">Error</h3>
                  <p className="text-xs text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 ml-4 text-red-600 hover:text-red-800 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Auction Purchases</h1>
                  <p className="text-gray-600 mt-1">Manage and track your auction vehicle purchases</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAuction(null);
                setShowModal(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Auction
            </button>
          </div>
        </div>



        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search vehicles by make, model, year, or VIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-3" />
                <select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                  <option value="reserved">Reserved</option>
                </select>
              </div>

              <div>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white shadow-xl rounded-xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedAuction ? 'Edit Auction Purchase' : 'Add New Auction Purchase'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedAuction(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <AuctionPurchaseForm
                initialData={selectedAuction}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowModal(false);
                  setSelectedAuction(null);
                }}
                isEditing={!!selectedAuction}
              />
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="text-gray-600 font-medium">Loading auction purchases...</p>
              </div>
            </div>
          ) : auctions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('make')}
                    >
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-2 text-gray-400" />
                        Vehicle
                        {sortField === 'make' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="inline h-4 w-4 ml-2 text-blue-600" /> : 
                            <ChevronDown className="inline h-4 w-4 ml-2 text-blue-600" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('purchase_date')}
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        Purchase Date
                        {sortField === 'purchase_date' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="inline h-4 w-4 ml-2 text-blue-600" /> : 
                            <ChevronDown className="inline h-4 w-4 ml-2 text-blue-600" />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('purchase_price')}
                    >
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        Purchase Price
                        {sortField === 'purchase_price' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="inline h-4 w-4 ml-2 text-blue-600" /> : 
                            <ChevronDown className="inline h-4 w-4 ml-2 text-blue-600" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2 text-gray-400" />
                        Status
                      </div>
                    </th>
                    <th 
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('list_price')}
                    >
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                        List Price
                        {sortField === 'list_price' && (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="inline h-4 w-4 ml-2 text-blue-600" /> : 
                            <ChevronDown className="inline h-4 w-4 ml-2 text-blue-600" />
                        )}
                      </div>
                    </th>

                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auctions.map((auction) => (
                    <tr 
                      key={auction.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => handleRowClick(auction.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0">
                            {auction.images?.[0] ? (
                              <img
                                className="h-12 w-12 rounded-xl object-cover border border-gray-200"
                                src={auction.images[0]}
                                alt={`${auction.make} ${auction.model}`}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                                <Car className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {auction.make} {auction.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {auction.year} • {auction.vin}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(auction.purchase_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${auction.purchase_price?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(auction.status)}`}>
                          {auction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${auction.list_price?.toLocaleString()}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No auction purchases found</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first auction purchase.</p>
                <button
                  onClick={() => {
                    setSelectedAuction(null);
                    setShowModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Purchase
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-semibold">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-semibold">
                    {Math.min(currentPage * itemsPerPage, pagination.total_items)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold">{pagination.total_items}</span>{' '}
                  results
                </p>
              </div>
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${
                    currentPage === 1
                      ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                      : 'text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  } transition-colors`}
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                  <ChevronDown className="h-4 w-4 -ml-2 rotate-90" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.has_previous}
                  className={`p-2 rounded-lg border ${
                    !pagination.has_previous
                      ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                      : 'text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  } transition-colors`}
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
                
                {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                  .filter(page => {
                    const distance = Math.abs(page - currentPage);
                    return distance === 0 || distance === 1 || page === 1 || page === pagination.total_pages;
                  })
                  .map((page, index, array) => {
                    if (index > 0 && array[index - 1] !== page - 1) {
                      return [
                        <span
                          key={`ellipsis-${page}`}
                          className="px-3 py-2 text-gray-500"
                        >
                          ...
                        </span>,
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          {page}
                        </button>
                      ];
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className={`p-2 rounded-lg border ${
                    !pagination.has_next
                      ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                      : 'text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  } transition-colors`}
                >
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.total_pages)}
                  disabled={currentPage === pagination.total_pages}
                  className={`p-2 rounded-lg border ${
                    currentPage === pagination.total_pages
                      ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                      : 'text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                  } transition-colors`}
                >
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                  <ChevronDown className="h-4 w-4 -ml-2 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuctionsPage;