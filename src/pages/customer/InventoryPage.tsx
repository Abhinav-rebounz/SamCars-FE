import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import VehicleCard from '../../components/VehicleCard';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  vin: string;
  exteriorColor: string;
  interiorColor: string;
  transmission: string;
  bodyType: string;
  description: string;
  tags: string[];
  images: string[];
  fuel_type?: string;
  engine?: string;
  condition?: string;
  stock_number?: string;
  location?: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  // Add any other properties that might be returned from the backend
}

const InventoryPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    minMileage: '',
    maxMileage: '',
    bodyType: '',
    transmission: '',
    tags: [] as string[],
  });
  const [sortBy, setSortBy] = useState('newest');

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.GET_INVENTORY}`);
        const apiVehicles = response.data.data?.vehicles || [];
        const normalizedVehicles = apiVehicles.map((v: any) => ({
          ...v,
          images: v.image_url ? [v.image_url] : [],
          tags: Array.isArray(v.tags)
            ? v.tags
            : typeof v.tags === 'string'
              ? JSON.parse(v.tags)
              : [],
        }));
        setVehicles(normalizedVehicles);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching vehicles:', err);
        setError('Failed to load vehicles. Please try again later.');
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Get unique values for filter dropdowns based on fetched vehicles
  const getDynamicUniqueValues = (key: keyof Vehicle) => {
    // Ensure vehicles is an array and not empty before attempting to map
    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      return [];
    }
    
    // Ensure the key exists on the Vehicle type and filter out null/undefined
    return Array.from(new Set(vehicles.map(vehicle => vehicle[key]))).filter(Boolean).map(String);
  };

  const makes = getDynamicUniqueValues('make');
  const bodyTypes = getDynamicUniqueValues('bodyType');
  const transmissions = getDynamicUniqueValues('transmission');

  // Helper function for filtering
  const applyFilters = (vehiclesToFilter: Vehicle[]) => {
    return vehiclesToFilter.filter(vehicle => {
      // Make filter
      if (filters.make && vehicle.make !== filters.make) return false;
      // Model filter
      if (filters.model && !vehicle.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
      // Year range
      if (filters.minYear && vehicle.year < parseInt(filters.minYear)) return false;
      if (filters.maxYear && vehicle.year > parseInt(filters.maxYear)) return false;
      // Price range
      if (filters.minPrice && vehicle.price < parseInt(filters.minPrice)) return false;
      if (filters.maxPrice && vehicle.price > parseInt(filters.maxPrice)) return false;
      // Mileage range
      if (filters.minMileage && vehicle.mileage < parseInt(filters.minMileage)) return false;
      if (filters.maxMileage && vehicle.mileage > parseInt(filters.maxMileage)) return false;
      // Body type
      if (filters.bodyType && vehicle.bodyType !== filters.bodyType) return false;
      // Transmission
      if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
      // Tags
      if (filters.tags.length > 0) {
        const vehicleTagsLower = (vehicle.tags || []).map(tag => tag.toLowerCase());
        if (!filters.tags.every(tag => vehicleTagsLower.includes(tag.toLowerCase()))) return false;
      }
      return true;
    });
  };

  // Helper function for sorting
  const applySorting = (vehiclesToSort: Vehicle[]) => {
    const sorted = [...vehiclesToSort];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'mileage-asc':
        return sorted.sort((a, b) => a.mileage - b.mileage);
      case 'mileage-desc':
        return sorted.sort((a, b) => b.mileage - a.mileage);
      case 'year-desc':
        return sorted.sort((a, b) => b.year - a.year);
      case 'year-asc':
        return sorted.sort((a, b) => a.year - b.year);
      default:
        return sorted;
    }
  };

  // Apply filters and sorting whenever filters or vehicles change
  useEffect(() => {
    let result = applyFilters(vehicles);
    result = applySorting(result);
    setFilteredVehicles(result);
  }, [filters, sortBy, vehicles]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Handle tag filter changes
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFilters(prev => {
      if (checked) {
        return { ...prev, tags: [...prev.tags, value] };
      } else {
        return { ...prev, tags: prev.tags.filter(tag => tag !== value) };
      }
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      make: '',
      model: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      minMileage: '',
      maxMileage: '',
      bodyType: '',
      transmission: '',
      tags: [],
    });
    setSortBy('newest');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Loading vehicles...</p>
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
              {/* Make */}
              <div>
                <label className="form-label">Make</label>
                <select 
                  name="make" 
                  value={filters.make}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">All Makes</option>
                  {makes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="form-label">Model</label>
                <input
                  type="text"
                  name="model"
                  placeholder="e.g., Camry"
                  value={filters.model}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>

              {/* Price Range */}
              <div>
                <label className="form-label">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="form-label">Year Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minYear"
                    placeholder="Min"
                    value={filters.minYear}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <input
                    type="number"
                    name="maxYear"
                    placeholder="Max"
                    value={filters.maxYear}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              {/* Mileage Range */}
              <div>
                <label className="form-label">Mileage Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minMileage"
                    placeholder="Min"
                    value={filters.minMileage}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <input
                    type="number"
                    name="maxMileage"
                    placeholder="Max"
                    value={filters.maxMileage}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="form-label">Body Type</label>
                <select 
                  name="bodyType" 
                  value={filters.bodyType}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">All Types</option>
                  {bodyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="form-label">Transmission</label>
                <select 
                  name="transmission" 
                  value={filters.transmission}
                  onChange={handleFilterChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="">All Transmissions</option>
                  {transmissions.map(transmission => (
                    <option key={transmission} value={transmission}>{transmission}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="form-label">Tags</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tag-new"
                      name="tags"
                      value="New Arrivals"
                      checked={filters.tags.includes('New Arrivals')}
                      onChange={handleTagChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="tag-new" className="ml-2 text-sm text-gray-700">
                      New Arrivals
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tag-featured"
                      name="tags"
                      value="Featured Vehicles"
                      checked={filters.tags.includes('Featured Vehicles')}
                      onChange={handleTagChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="tag-featured" className="ml-2 text-sm text-gray-700">
                      Featured Vehicles
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tag-sale"
                      name="tags"
                      value="On Sale"
                      checked={filters.tags.includes('On Sale')}
                      onChange={handleTagChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="tag-sale" className="ml-2 text-sm text-gray-700">
                      On Sale
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tag-low-mileage"
                      name="tags"
                      value="Low Mileage"
                      checked={filters.tags.includes('Low Mileage')}
                      onChange={handleTagChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="tag-low-mileage" className="ml-2 text-sm text-gray-700">
                      Low Mileage
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tag-certified"
                      name="tags"
                      value="Certified Pre-Owned"
                      checked={filters.tags.includes('Certified Pre-Owned')}
                      onChange={handleTagChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="tag-certified" className="ml-2 text-sm text-gray-700">
                      Certified Pre-Owned
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-700">Showing {filteredVehicles.length} of {vehicles.length} vehicles</span>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort-by" className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  id="sort-by"
                  name="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="mileage-asc">Mileage: Low to High</option>
                  <option value="mileage-desc">Mileage: High to Low</option>
                  <option value="year-desc">Year: New to Old</option>
                  <option value="year-asc">Year: Old to New</option>
                </select>
              </div>
            </div>

            {filteredVehicles.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">No vehicles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
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
            )}

            {/* Pagination (if needed, will add later) */}
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
                {/* Mobile Make Filter */}
                <div>
                  <label className="form-label">Make</label>
                  <select 
                    name="make" 
                    value={filters.make}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="">All Makes</option>
                    {makes.map(make => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile Model */}
                <div>
                  <label className="form-label">Model</label>
                  <input
                    type="text"
                    name="model"
                    placeholder="e.g., Camry"
                    value={filters.model}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>

                {/* Mobile Price Range */}
                <div>
                  <label className="form-label">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                {/* Mobile Year Range */}
                <div>
                  <label className="form-label">Year Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minYear"
                      placeholder="Min"
                      value={filters.minYear}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <input
                      type="number"
                      name="maxYear"
                      placeholder="Max"
                      value={filters.maxYear}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                {/* Mobile Mileage Range */}
                <div>
                  <label className="form-label">Mileage Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minMileage"
                      placeholder="Min"
                      value={filters.minMileage}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <input
                      type="number"
                      name="maxMileage"
                      placeholder="Max"
                      value={filters.maxMileage}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                {/* Mobile Body Type */}
                <div>
                  <label className="form-label">Body Type</label>
                  <select 
                    name="bodyType" 
                    value={filters.bodyType}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="">All Types</option>
                    {bodyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile Transmission */}
                <div>
                  <label className="form-label">Transmission</label>
                  <select 
                    name="transmission" 
                    value={filters.transmission}
                    onChange={handleFilterChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="">All Transmissions</option>
                    {transmissions.map(transmission => (
                      <option key={transmission} value={transmission}>{transmission}</option>
                    ))}
                  </select>
                </div>

                {/* Mobile Tags */}
                <div>
                  <label className="form-label">Tags</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-tag-new"
                        name="tags"
                        value="New Arrivals"
                        checked={filters.tags.includes('New Arrivals')}
                        onChange={handleTagChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label htmlFor="mobile-tag-new" className="ml-2 text-sm text-gray-700">
                        New Arrivals
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-tag-featured"
                        name="tags"
                        value="Featured Vehicles"
                        checked={filters.tags.includes('Featured Vehicles')}
                        onChange={handleTagChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label htmlFor="mobile-tag-featured" className="ml-2 text-sm text-gray-700">
                        Featured Vehicles
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-tag-sale"
                        name="tags"
                        value="On Sale"
                        checked={filters.tags.includes('On Sale')}
                        onChange={handleTagChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label htmlFor="mobile-tag-sale" className="ml-2 text-sm text-gray-700">
                        On Sale
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-tag-low-mileage"
                        name="tags"
                        value="Low Mileage"
                        checked={filters.tags.includes('Low Mileage')}
                        onChange={handleTagChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label htmlFor="mobile-tag-low-mileage" className="ml-2 text-sm text-gray-700">
                        Low Mileage
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="mobile-tag-certified"
                        name="tags"
                        value="Certified Pre-Owned"
                        checked={filters.tags.includes('Certified Pre-Owned')}
                        onChange={handleTagChange}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <label htmlFor="mobile-tag-certified" className="ml-2 text-sm text-gray-700">
                        Certified Pre-Owned
                      </label>
                    </div>
                  </div>
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