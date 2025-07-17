import React, { useState, useEffect } from 'react';
import { getAuctionPurchases } from '../../services/auction';
import AuctionPurchaseForm from '../../components/auction/AuctionPurchaseForm';
import { Edit, Search, Filter, ChevronDown, ChevronUp, Plus } from 'lucide-react';
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
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

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 font-bold text-xl"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Auction Purchases</h1>
        <button
          onClick={() => {
            setSelectedAuction(null);
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Auction
        </button>
      </div>

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search auctions..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative inline-flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="block w-full pl-10 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>

            <div className="relative inline-flex">
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="block w-full px-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white shadow-lg rounded-lg p-6 m-4 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedAuction ? 'Edit Auction Purchase' : 'Add New Auction Purchase'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedAuction(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-7xl mx-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-600">Loading...</div>
        ) : auctions.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('make')}
                >
                  Vehicle
                  {sortField === 'make' && (
                    sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('purchase_date')}
                >
                  Purchase Date
                  {sortField === 'purchase_date' && (
                    sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('purchase_price')}
                >
                  Purchase Price
                  {sortField === 'purchase_price' && (
                    sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('list_price')}
                >
                  List Price
                  {sortField === 'list_price' && (
                    sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auctions.map((auction) => (
                <tr 
                  key={auction.id}
                  onClick={() => handleRowClick(auction.id)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {auction.images?.[0] ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={auction.images[0]}
                            alt={`${auction.make} ${auction.model}`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No img</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {auction.make} {auction.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          {auction.year} - {auction.vin}
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
                    <div className="text-sm text-gray-900">
                      ${auction.purchase_price?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      auction.status === 'available' ? 'bg-green-100 text-green-800' :
                      auction.status === 'sold' ? 'bg-red-100 text-red-800' :
                      auction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      auction.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {auction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${auction.list_price?.toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-center text-gray-600">No auction purchases found</div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.has_previous}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                pagination.has_previous
                  ? 'text-gray-700 bg-white hover:bg-gray-50'
                  : 'text-gray-300 bg-gray-50 cursor-not-allowed'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.has_next}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                pagination.has_next
                  ? 'text-gray-700 bg-white hover:bg-gray-50'
                  : 'text-gray-300 bg-gray-50 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, pagination.total_items)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total_items}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">First</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                  <ChevronDown className="h-5 w-5 -ml-2 rotate-90" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.has_previous}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    !pagination.has_previous
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
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
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>,
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                            currentPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white text-gray-500 hover:bg-gray-50'
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
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    !pagination.has_next
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.total_pages)}
                  disabled={currentPage === pagination.total_pages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === pagination.total_pages
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Last</span>
                  <ChevronDown className="h-5 w-5 -rotate-90" />
                  <ChevronDown className="h-5 w-5 -ml-2 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionsPage;