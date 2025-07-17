import {
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  Plus,
  Search,
  Trash2,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS, api } from '../../config/api';
import { getInventory, deleteVehicle } from '../../services/inventory';
import { Vehicle as VehicleType } from '../../types/vehicle';
import AddVehicleForm from '../../components/inventory/AddVehicleForm';

type Vehicle = VehicleType;

// Define pagination data from API
interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

const Inventory: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date_added');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const navigate = useNavigate();

  // Fetch vehicles from API
  const fetchVehicles = async () => {
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
      const response = await getInventory(filters);
      if (response.success && response.vehicles) {
        setVehicles(response.vehicles);
        setPagination(response.pagination);
      } else {
        setError(response.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      setError('Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicles on mount and when dependencies change
  useEffect(() => {
    fetchVehicles();
  }, [searchTerm, sortField, sortDirection, currentPage, itemsPerPage, filterStatus]);

  // Filter and sort vehicles (client-side fallback)
  const filteredVehicles = vehicles.filter(vehicle => {
    const searchString = `${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.vin}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a];
    let bValue: any = b[sortField as keyof typeof b];

    if (sortField === 'created_at') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    const fieldMap: { [key: string]: string } = {
      make: 'make',
      year: 'year',
      price: 'price',
      mileage: 'mileage',
      created_at: 'date_added',  // Map created_at to date_added
    };
    const apiField = fieldMap[field] || field;
    if (apiField === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(apiField);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleDelete = (id: string | number) => {
    setSelectedVehicleId(id.toString());
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedVehicleId) return;
    try {
      const response = await deleteVehicle(selectedVehicleId);
      
      if (response.success) {
        setShowDeleteModal(false);
        setSelectedVehicleId(null);
        setSuccessMessage('Vehicle deleted successfully!');
        await fetchVehicles(); // Refetch to sync with backend
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to delete vehicle');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete vehicle');
      console.error('Error deleting vehicle:', err);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedVehicle(null);
  };

  const handlePageChange = (page: number) => {
    if (pagination && (page < 1 || page > pagination.total_pages)) return;
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (vehicle: Vehicle) => {
    console.log('Editing vehicle:', vehicle);
    console.log('Setting selectedVehicle and showEditModal to true');
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
    console.log('Edit modal should now be visible');
  };

  const handleEditComplete = () => {
    setShowEditModal(false);
    setSelectedVehicle(null);
    setSuccessMessage('Vehicle updated successfully!');
    fetchVehicles(); // Refresh the list after edit
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAddComplete = () => {
    setShowAddModal(false);
    setError(null); // Clear any previous error
    setSuccessMessage('Vehicle added successfully!');
    fetchVehicles(); // Refresh the list after add
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleImageError = (vehicleId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [vehicleId]: true
    }));
  };

  const handleVehicleClick = (id: string | number) => {
    navigate(`/admin/inventory/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
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
                placeholder="Search vehicles by name or VIN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={filterStatus}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Vehicles</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="space-y-4">
          {[...Array(itemsPerPage)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4 p-4 bg-gray-100 rounded">
              <div className="rounded-full bg-gray-300 h-10 w-10" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-300 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inventory Table */}
      {!loading && !error && vehicles.length === 0 && (
        <div className="text-center py-8 text-gray-500">No vehicles found.</div>
      )}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('created_at')}>
                    Date Added
                    {sortField === 'date_added' && (  // Update the condition to check for date_added
                      sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                    )}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('price')}>
                    Price
                    {sortField === 'price' && (
                      sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedVehicles.map((vehicle) => (
                  <tr 
                    key={vehicle.id}
                    onClick={() => handleVehicleClick(vehicle.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          {!imageErrors[vehicle.id] && vehicle.images && vehicle.images[0] ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={vehicle.images[0]}
                              alt=""
                              onError={() => handleImageError(vehicle.id)}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            VIN: {vehicle.vin}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vehicle.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'sold' ? 'bg-red-100 text-red-800' :
                        vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${vehicle.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.has_previous}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.has_next}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((pagination.current_page - 1) * pagination.items_per_page) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.current_page * pagination.items_per_page, pagination.total_items)}
                </span>{' '}
                of <span className="font-medium">{pagination.total_items}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.has_previous}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.has_next}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
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
                  onClick={closeAddModal}
                  aria-label="Close Add Vehicle Form"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Plus className="h-6 w-6 text-blue-700" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add New Vehicle
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Fill out the form below to add a new vehicle to the inventory.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4">
                  <AddVehicleForm
                    onSuccess={handleAddComplete}
                    onCancel={closeAddModal}
                    isEditing={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {(() => {
        console.log('showEditModal:', showEditModal, 'selectedVehicle:', selectedVehicle);
        return null;
      })()}
      {showEditModal && selectedVehicle && (
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
                    initialData={selectedVehicle}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Delete Vehicle
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this vehicle? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;