import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import VehicleCard from '../../components/VehicleCard';
import { vehicles, filterVehicles, sortVehicles, getUniqueValues } from '../../data/vehicles';

const InventoryPage: React.FC = () => {
  const [filteredVehicles, setFilteredVehicles] = useState(vehicles);
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

  // Get unique values for filter dropdowns
  const makes = getUniqueValues('make') as string[];
  const bodyTypes = getUniqueValues('bodyType') as string[];
  const transmissions = getUniqueValues('transmission') as string[];

  // Apply filters and sorting
  useEffect(() => {
    let result = filterVehicles(vehicles, {
      make: filters.make,
      model: filters.model,
      minYear: filters.minYear ? parseInt(filters.minYear) : undefined,
      maxYear: filters.maxYear ? parseInt(filters.maxYear) : undefined,
      minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
      minMileage: filters.minMileage ? parseInt(filters.minMileage) : undefined,
      maxMileage: filters.maxMileage ? parseInt(filters.maxMileage) : undefined,
      bodyType: filters.bodyType,
      transmission: filters.transmission,
      tags: filters.tags,
    });
    
    result = sortVehicles(result, sortBy as any);
    
    setFilteredVehicles(result);
  }, [filters, sortBy]);

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
                      value="new"
                      checked={filters.tags.includes('new')}
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
                      value="featured"
                      checked={filters.tags.includes('featured')}
                      onChange={handleTagChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="tag-featured" className="ml-2 text-sm text-gray-700">
                      Featured
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="tag-price-drop"
                      name="tags"
                      value="price-drop"
                      checked={filters.tags.includes('price-drop')}
                      onChange={handleTagChange}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor="tag-price-drop" className="ml-2 text-sm text-gray-700">
                      Price Drop
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full bg-white rounded-md shadow-sm px-4 py-2 flex items-center justify-center text-gray-700 hover:bg-gray-50"
              >
                <Filter className="h-5 w-5 mr-2" />
                <span>Filters</span>
              </button>
            </div>

            {/* Mobile Filters */}
            {isFilterOpen && (
              <div className="lg:hidden bg-white rounded-lg shadow-md p-4 mb-4">
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

                  {/* Tags */}
                  <div>
                    <label className="form-label">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="mobile-tag-new"
                          name="tags"
                          value="new"
                          checked={filters.tags.includes('new')}
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
                          value="featured"
                          checked={filters.tags.includes('featured')}
                          onChange={handleTagChange}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <label htmlFor="mobile-tag-featured" className="ml-2 text-sm text-gray-700">
                          Featured
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="mobile-tag-price-drop"
                          name="tags"
                          value="price-drop"
                          checked={filters.tags.includes('price-drop')}
                          onChange={handleTagChange}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <label htmlFor="mobile-tag-price-drop" className="ml-2 text-sm text-gray-700">
                          Price Drop
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full mt-4 bg-blue-700 text-white rounded-md py-2"
                >
                  Apply Filters
                </button>
              </div>
            )}

            {/* Sort and Results Count */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-2 sm:mb-0">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredVehicles.length}</span> vehicles
                </p>
              </div>
              <div className="flex items-center">
                <SlidersHorizontal className="h-5 w-5 text-gray-500 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Year: Newest First</option>
                  <option value="year-asc">Year: Oldest First</option>
                  <option value="mileage-asc">Mileage: Low to High</option>
                  <option value="mileage-desc">Mileage: High to Low</option>
                </select>
              </div>
            </div>

            {/* Vehicle Grid */}
            {filteredVehicles.length > 0 ? (
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
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to find vehicles that match your criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-primary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;