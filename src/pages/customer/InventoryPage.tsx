import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import VehicleCard from '../../components/VehicleCard';
import { getInventory, type InventoryFilters, type PaginationInfo, type FilterStats } from '../../services/inventory';
import { Vehicle as VehicleType } from '../../types/vehicle';

interface Vehicle extends VehicleType {
  // Add any additional properties that might be returned from the backend
}

const InventoryPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [filterStats, setFilterStats] = useState<FilterStats | null>(null);
  
  const [filters, setFilters] = useState<InventoryFilters>({
    category: 'all',
    limit: 9,
    page: 1,
    search: '',
    sort_by: 'date_added',
    sort_order: 'desc',
    status: 'available'
  });

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        console.log('Fetching vehicles with filters:', filters);
        const response = await getInventory(filters);
        console.log('Got response:', response);
        if (response.success) {
          setVehicles(response.vehicles || []);
          setPagination(response.pagination || null);
          setFilterStats(response.filter_stats || null);
          setError(null);
        } else {
          setError(response.error || 'Failed to load vehicles');
        }
      } catch (err: any) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 })); // Reset to page 1 when filters change
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (!pagination || newPage <= pagination.total_pages)) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: 'all',
      limit: 9,
      page: 1,
      search: '',
      sort_by: 'date_added',
      sort_order: 'desc',
      status: 'available'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-3xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4 p-4 bg-gray-100 rounded">
              <div className="rounded bg-gray-300 h-32 w-48" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-6 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <h1 className="heading-lg mb-2">Our Inventory</h1>
        <p className="text-gray-600 mb-8">
          Browse our selection of quality pre-owned vehicles.
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 bg-white rounded-lg shadow-md p-4 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button 
                onClick={resetFilters}
                className="text-sm text-blue-700 hover:text-blue-800"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4">
              {/* Category Filter */}
              <div>
                <label className="form-label">Category</label>
                <select 
                  name="category" 
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="all">All Categories</option>
                  <option value="sedan">Sedan ({filterStats?.categories.sedan || 0})</option>
                  <option value="suv">SUV ({filterStats?.categories.suv || 0})</option>
                  <option value="truck">Truck ({filterStats?.categories.truck || 0})</option>
                  <option value="electric">Electric ({filterStats?.categories.electric || 0})</option>
                  <option value="luxury">Luxury ({filterStats?.categories.luxury || 0})</option>
                  <option value="compact">Compact ({filterStats?.categories.compact || 0})</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="form-label">Search</label>
                <input
                  type="text"
                  name="search"
                  placeholder="Search by make, model, or year"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="form-label">Sort By</label>
                <select
                  name="sort_by"
                  value={filters.sort_by}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="date_added">Newest Arrivals</option>
                  <option value="price">Price</option>
                  <option value="year">Year</option>
                  <option value="mileage">Mileage</option>
                  <option value="make">Make</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="form-label">Sort Order</label>
                <select
                  name="sort_order"
                  value={filters.sort_order}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="desc">High to Low</option>
                  <option value="asc">Low to High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="all">All Vehicles</option>
                  <option value="available">Available ({filterStats?.total_available || 0})</option>
                  <option value="sold">Sold ({filterStats?.total_sold || 0})</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-700">
                Showing {vehicles.length} of {pagination?.total_items || 0} vehicles
              </span>
            </div>

            {vehicles.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">No vehicles found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map(vehicle => (
                    <VehicleCard
                      key={vehicle.id}
                      id={vehicle.id}
                      make={vehicle.make}
                      model={vehicle.model}
                      year={vehicle.year}
                      price={vehicle.price}
                      mileage={vehicle.mileage}
                      image={vehicle.images[0]}
                      condition={vehicle.condition}
                      tags={vehicle.tags}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <div className="mt-8 flex justify-center items-center space-x-4">
                    <button
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={!pagination.has_previous}
                      className={`flex items-center px-3 py-2 rounded-md ${
                        pagination.has_previous
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </button>
                    
                    <span className="text-gray-600">
                      Page {pagination.current_page} of {pagination.total_pages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={!pagination.has_next}
                      className={`flex items-center px-3 py-2 rounded-md ${
                        pagination.has_next
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden fixed bottom-4 right-4 bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-40"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="w-6 h-6 mr-2" />
          Filter
        </button>

        {/* Mobile Filter Modal */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-6 relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-2xl">Filters</h2>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg"
                  aria-label="Close filters"
                >
                  &times;
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Mobile Category Filter */}
                <div>
                  <label className="form-label">Category</label>
                  <select 
                    name="category" 
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="all">All Categories</option>
                    <option value="sedan">Sedan ({filterStats?.categories.sedan || 0})</option>
                    <option value="suv">SUV ({filterStats?.categories.suv || 0})</option>
                    <option value="truck">Truck ({filterStats?.categories.truck || 0})</option>
                    <option value="electric">Electric ({filterStats?.categories.electric || 0})</option>
                    <option value="luxury">Luxury ({filterStats?.categories.luxury || 0})</option>
                    <option value="compact">Compact ({filterStats?.categories.compact || 0})</option>
                  </select>
                </div>

                {/* Mobile Search */}
                <div>
                  <label className="form-label">Search</label>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search by make, model, or year"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>

                {/* Mobile Sort By */}
                <div>
                  <label className="form-label">Sort By</label>
                  <select
                    name="sort_by"
                    value={filters.sort_by}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="date_added">Newest Arrivals</option>
                    <option value="price">Price</option>
                    <option value="year">Year</option>
                    <option value="mileage">Mileage</option>
                    <option value="make">Make</option>
                  </select>
                </div>

                {/* Mobile Sort Order */}
                <div>
                  <label className="form-label">Sort Order</label>
                  <select
                    name="sort_order"
                    value={filters.sort_order}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="desc">High to Low</option>
                    <option value="asc">Low to High</option>
                  </select>
                </div>

                {/* Mobile Status */}
                <div>
                  <label className="form-label">Status</label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="all">All Vehicles</option>
                    <option value="available">Available ({filterStats?.total_available || 0})</option>
                    <option value="sold">Sold ({filterStats?.total_sold || 0})</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={resetFilters}
                  className="btn-secondary px-4 py-2"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="btn-primary px-4 py-2"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;