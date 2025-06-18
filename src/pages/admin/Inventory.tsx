import {
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  Plus,
  Search,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import api from '../../services/api';
import axios from 'axios';

// Define a type for vehicle data
interface Vehicle {
  id: string;
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
  isSold: boolean;
  tags: string[];
  images: string[];
  dateAdded: string;
  fuel_type?: string;
  engine?: string;
  condition?: string;
  stock_number?: string;
  location?: string;
  is_featured: boolean;
}

// Define pagination data from API
interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_previous: boolean;
}

// State for the new vehicle form
interface NewVehicle {
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
  images: (File | string)[]; // Allow both File objects and URLs
  fuel_type: string;
  engine: string;
  condition: string;
  stock_number: string;
  location: string;
  is_featured: boolean;
}

const Inventory: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('date_added');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [addFormError, setAddFormError] = useState<string | null>(null);
  const [addFormSuccess, setAddFormSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  // State for the new vehicle form
  const [newVehicle, setNewVehicle] = useState<NewVehicle>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    vin: '',
    exteriorColor: '',
    interiorColor: '',
    transmission: '',
    bodyType: '',
    description: '',
    tags: [],
    images: [],
    fuel_type: '',
    engine: '',
    condition: '',
    stock_number: '',
    location: '',
    is_featured: false,
  });

  // Fetch vehicles from API
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        sort_by: sortField,
        sort_order: sortDirection,
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(filterStatus && { status: filterStatus }),
      });

      const response = await api.get(`${API_BASE_URL}${API_ENDPOINTS.GET_INVENTORY}?${params}`, {
        headers: {
          'Authorization': localStorage.getItem('token') || ''
        }
      });

      const responseData = response.data;
      if (responseData.status !== 'success') {
        throw new Error(responseData.message || 'Failed to fetch vehicles');
      }

      // Map API response to Vehicle interface
      const mappedVehicles: Vehicle[] = responseData.data.vehicles.map((v: any) => ({
        id: v.id.toString(),
        make: v.make,
        model: v.model,
        year: v.year,
        price: v.price,
        mileage: v.mileage,
        vin: v.vin || '',
        exteriorColor: v.exterior_color || '',
        interiorColor: v.interior_color || '',
        transmission: v.transmission || '',
        bodyType: v.body_type || '',
        description: v.description || '',
        isSold: v.status !== 'available',
        tags: v.tags || [],
        images: v.image_url ? [v.image_url] : [],
        dateAdded: v.date_added || new Date().toISOString(),
        fuel_type: v.fuel_type || '',
        engine: v.engine || '',
        condition: v.condition || '',
        stock_number: v.stock_number || '',
        location: v.location || '',
        is_featured: v.is_featured || false,
      }));

      setVehicles(mappedVehicles);
      setPagination(responseData.data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch vehicles');
      console.error('Error fetching vehicles:', err);
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

    if (sortField === 'dateAdded') {
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
      dateAdded: 'date_added',
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

  const handleDelete = (id: string) => {
    setSelectedVehicleId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedVehicleId) return;
    try {
      const response = await api.delete(`${API_BASE_URL}${API_ENDPOINTS.DELETE_VEHICLE(selectedVehicleId)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.status === 'success') {
        setShowDeleteModal(false);
        setSelectedVehicleId(null);
        await fetchVehicles(); // Refetch to sync with backend
      } else {
        setError(response.data.message || 'Failed to delete vehicle');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete vehicle');
      console.error('Error deleting vehicle:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (selectedVehicle) {
      setSelectedVehicle(prev => ({
        ...prev!,
        [name]: value
      }));
    }
    
    setNewVehicle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (selectedVehicle) {
      setSelectedVehicle(prev => {
        const newTags = checked
          ? [...prev!.tags, value]
          : prev!.tags.filter(tag => tag !== value);
        return { ...prev!, tags: newTags };
      });
    } else {
      setNewVehicle(prev => {
        const newTags = checked
          ? [...prev.tags, value]
          : prev.tags.filter(tag => tag !== value);
        return { ...prev, tags: newTags };
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setNewVehicle(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewVehicle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const renderImagePreview = (image: File | string, index: number) => {
    const imageUrl = image instanceof File ? URL.createObjectURL(image) : image;
    return (
      <div key={index} className="relative group">
        <img
          src={imageUrl}
          alt={`Preview ${index + 1}`}
          className="w-full h-32 object-cover rounded-lg"
          onError={(e) => {
            console.error(`Error loading image ${index}:`, e);
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/150?text=Image+Error';
          }}
        />
        <button
          type="button"
          onClick={() => handleRemoveImage(index)}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      // Cleanup any object URLs created for image previews
      newVehicle.images.forEach(image => {
        if (image instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(image));
        }
      });
    };
  }, [newVehicle.images]);

  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Add all vehicle data to formData
      Object.entries(newVehicle).forEach(([key, value]) => {
        if (key === 'images') {
          // Handle images - only send new files, keep existing URLs
          const images = value as (File | string)[];
          images.forEach((image, index) => {
            if (image instanceof File) {
              formData.append(`images`, image);
            } else {
              formData.append(`existingImages`, image);
            }
          });
        } else if (key === 'tags') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      });

      if (selectedVehicle) {
        // Update existing vehicle
        const response = await axios.put(
          `${API_BASE_URL}/inventory/vehicles/update/${selectedVehicle.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        console.log('Update response:', response.data);
        setSuccessMessage('Vehicle updated successfully');
        setErrorMessage(null);
      } else {
        // Add new vehicle
        const response = await axios.post(
          `${API_BASE_URL}/inventory/vehicles/add`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        console.log('Add response:', response.data);
        setSuccessMessage('Vehicle added successfully');
        setErrorMessage(null);
      }

      // Clear form and close modal
      setNewVehicle({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        vin: '',
        exteriorColor: '',
        interiorColor: '',
        transmission: '',
        bodyType: '',
        description: '',
        tags: [],
        images: [],
        fuel_type: '',
        engine: '',
        condition: '',
        stock_number: '',
        location: '',
        is_featured: false,
      });
      setShowAddModal(false);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (error: any) {
      console.error('Error submitting vehicle:', error);
      if (error.response?.data?.error === 'duplicate_vin') {
        setErrorMessage('A vehicle with this VIN already exists');
        setSuccessMessage(null);
      } else {
        setErrorMessage(error.response?.data?.message || 'Error submitting vehicle');
        setSuccessMessage(null);
      }
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewVehicle({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      vin: '',
      exteriorColor: '',
      interiorColor: '',
      transmission: '',
      bodyType: '',
      description: '',
      tags: [],
      images: [],
      fuel_type: '',
      engine: '',
      condition: '',
      stock_number: '',
      location: '',
      is_featured: false,
    });
    setAddFormError(null);
    setAddFormSuccess(null);
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
    console.log('Editing vehicle:', vehicle); // Debug log
    setSelectedVehicle(vehicle);
    setNewVehicle({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      mileage: vehicle.mileage,
      vin: vehicle.vin,
      exteriorColor: vehicle.exteriorColor,
      interiorColor: vehicle.interiorColor,
      transmission: vehicle.transmission,
      bodyType: vehicle.bodyType,
      description: vehicle.description,
      tags: vehicle.tags || [],
      images: vehicle.images || [], // Keep existing images as URLs
      fuel_type: vehicle.fuel_type || '',
      engine: vehicle.engine || '',
      condition: vehicle.condition || '',
      stock_number: vehicle.stock_number || '',
      location: vehicle.location || '',
      is_featured: vehicle.is_featured || false,
    });
    setShowEditModal(true);
  };

  const handleEditComplete = () => {
    setShowEditModal(false);
    setSelectedVehicle(null);
    setNewVehicle({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      vin: '',
      exteriorColor: '',
      interiorColor: '',
      transmission: '',
      bodyType: '',
      description: '',
      tags: [],
      images: [],
      fuel_type: '',
      engine: '',
      condition: '',
      stock_number: '',
      location: '',
      is_featured: false,
    });
    fetchVehicles(); // Refresh the list after edit
  };

  const handleImageError = (vehicleId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [vehicleId]: true
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
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
        <div className="text-center py-4">
          <p className="text-gray-500">Loading vehicles...</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Inventory Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('make')}
                  >
                    <div className="flex items-center">
                      Vehicle
                      {sortField === 'make' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('year')}
                  >
                    <div className="flex items-center">
                      Year
                      {sortField === 'year' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      Price
                      {sortField === 'price' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('mileage')}
                  >
                    <div className="flex items-center">
                      Mileage
                      {sortField === 'mileage' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('dateAdded')}
                  >
                    <div className="flex items-center">
                      Date Added
                      {sortField === 'date_added' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {vehicle.images && vehicle.images.length > 0 && !imageErrors[vehicle.id] ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={vehicle.images[0]}
                              alt={`${vehicle.make} ${vehicle.model}`}
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
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            VIN: {vehicle.vin}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      ${vehicle.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.mileage.toLocaleString()} mi
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {vehicle.isSold ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Sold
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Available
                          </span>
                        )}
                        {vehicle.tags.length > 0 && (
                          <div className="ml-2 flex space-x-1">
                            {vehicle.tags.includes('new') && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                New
                              </span>
                            )}
                            {vehicle.tags.includes('featured') && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                Featured
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vehicle.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-700 hover:text-blue-800 mr-3"
                        onClick={() => handleEdit(vehicle)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(vehicle.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && (
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
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(currentPage * itemsPerPage, pagination.total_items)}</span> of{' '}
                    <span className="font-medium">{pagination.total_items}</span> results
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
                      <ChevronUp className="h-5 w-5 rotate-90" />
                    </button>
                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          page === currentPage ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {page}
                      </button>
                    ))}
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

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
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

                {/* Success and Error Messages */}
                {addFormError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {addFormError}</span>
                  </div>
                )}
                {addFormSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {addFormSuccess}</span>
                  </div>
                )}

                <div className="mt-5 sm:mt-4">
                  <form className="space-y-4" onSubmit={handleAddVehicleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                          Make
                        </label>
                        <input
                          type="text"
                          name="make"
                          id="make"
                          value={selectedVehicle ? selectedVehicle.make : newVehicle.make}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                          Model
                        </label>
                        <input
                          type="text"
                          name="model"
                          id="model"
                          value={selectedVehicle ? selectedVehicle.model : newVehicle.model}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                          Year
                        </label>
                        <input
                          type="number"
                          name="year"
                          id="year"
                          value={selectedVehicle ? selectedVehicle.year : newVehicle.year}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          value={selectedVehicle ? selectedVehicle.price : newVehicle.price}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                          Mileage
                        </label>
                        <input
                          type="number"
                          name="mileage"
                          id="mileage"
                          value={selectedVehicle ? selectedVehicle.mileage : newVehicle.mileage}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
                        VIN
                      </label>
                      <input
                        type="text"
                        name="vin"
                        id="vin"
                        value={selectedVehicle ? selectedVehicle.vin : newVehicle.vin}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="exteriorColor" className="block text-sm font-medium text-gray-700">
                          Exterior Color
                        </label>
                        <input
                          type="text"
                          name="exteriorColor"
                          id="exteriorColor"
                          value={selectedVehicle ? selectedVehicle.exteriorColor : newVehicle.exteriorColor}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="interiorColor" className="block text-sm font-medium text-gray-700">
                          Interior Color
                        </label>
                        <input
                          type="text"
                          name="interiorColor"
                          id="interiorColor"
                          value={selectedVehicle ? selectedVehicle.interiorColor : newVehicle.interiorColor}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">
                          Transmission
                        </label>
                        <select
                          name="transmission"
                          id="transmission"
                          value={selectedVehicle ? selectedVehicle.transmission : newVehicle.transmission}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Transmission</option>
                          <option value="automatic">Automatic</option>
                          <option value="manual">Manual</option>
                          <option value="cvt">CVT</option>
                          <option value="semi_automatic">Semi-Automatic</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700">
                          Body Type
                        </label>
                        <select
                          name="bodyType"
                          id="bodyType"
                          value={selectedVehicle ? selectedVehicle.bodyType : newVehicle.bodyType}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          required
                        >
                          <option value="">Select Body Type</option>
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="truck">Truck</option>
                          <option value="coupe">Coupe</option>
                          <option value="convertible">Convertible</option>
                          <option value="hatchback">Hatchback</option>
                          <option value="minivan">Minivan</option>
                          <option value="van">Van</option>
                          <option value="wagon">Wagon</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700">
                          Fuel Type
                        </label>
                        <select
                          name="fuel_type"
                          id="fuel_type"
                          value={selectedVehicle ? selectedVehicle.fuel_type : newVehicle.fuel_type}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Select Fuel Type</option>
                          <option value="gasoline">Gasoline</option>
                          <option value="diesel">Diesel</option>
                          <option value="electric">Electric</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="plug_in_hybrid">Plug-in Hybrid</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="engine" className="block text-sm font-medium text-gray-700">
                          Engine
                        </label>
                        <input
                          type="text"
                          name="engine"
                          id="engine"
                          value={selectedVehicle ? selectedVehicle.engine : newVehicle.engine}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                          Condition
                        </label>
                        <select
                          name="condition"
                          id="condition"
                          value={selectedVehicle ? selectedVehicle.condition : newVehicle.condition}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Select Condition</option>
                          <option value="new">New</option>
                          <option value="used">Used</option>
                          <option value="certified_pre_owned">Certified Pre-Owned</option>
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="stock_number" className="block text-sm font-medium text-gray-700">
                          Stock Number
                        </label>
                        <input
                          type="text"
                          name="stock_number"
                          id="stock_number"
                          value={selectedVehicle ? selectedVehicle.stock_number : newVehicle.stock_number}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={selectedVehicle ? selectedVehicle.location : newVehicle.location}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={selectedVehicle ? selectedVehicle.description : newVehicle.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <div className="flex items-center">
                          <input
                            id="tag-new"
                            name="tags"
                            type="checkbox"
                            value="new"
                            checked={selectedVehicle ? selectedVehicle.tags.includes('new') : newVehicle.tags.includes('new')}
                            onChange={handleTagChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="tag-new" className="ml-2 block text-sm text-gray-700">
                            New Arrival
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="tag-featured"
                            name="tags"
                            type="checkbox"
                            value="featured"
                            checked={selectedVehicle ? selectedVehicle.tags.includes('featured') : newVehicle.tags.includes('featured')}
                            onChange={handleTagChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="tag-featured" className="ml-2 block text-sm text-gray-700">
                            Featured
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="tag-price-drop"
                            name="tags"
                            type="checkbox"
                            value="price-drop"
                            checked={selectedVehicle ? selectedVehicle.tags.includes('price-drop') : newVehicle.tags.includes('price-drop')}
                            onChange={handleTagChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="tag-price-drop" className="ml-2 block text-sm text-gray-700">
                            Price Drop
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="tag-low-mileage"
                            name="tags"
                            type="checkbox"
                            value="low-mileage"
                            checked={selectedVehicle ? selectedVehicle.tags.includes('low-mileage') : newVehicle.tags.includes('low-mileage')}
                            onChange={handleTagChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="tag-low-mileage" className="ml-2 block text-sm text-gray-700">
                            Low Mileage
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="tag-certified"
                            name="tags"
                            type="checkbox"
                            value="certified"
                            checked={selectedVehicle ? selectedVehicle.tags.includes('certified') : newVehicle.tags.includes('certified')}
                            onChange={handleTagChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="tag-certified" className="ml-2 block text-sm text-gray-700">
                            Certified
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="tag-one-owner"
                            name="tags"
                            type="checkbox"
                            value="one-owner"
                            checked={selectedVehicle ? selectedVehicle.tags.includes('one-owner') : newVehicle.tags.includes('one-owner')}
                            onChange={handleTagChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="tag-one-owner" className="ml-2 block text-sm text-gray-700">
                            One Owner
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="tag-clean-history"
                            name="tags"
                            type="checkbox"
                            value="clean-history"
                            checked={selectedVehicle ? selectedVehicle.tags.includes('clean-history') : newVehicle.tags.includes('clean-history')}
                            onChange={handleTagChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="tag-clean-history" className="ml-2 block text-sm text-gray-700">
                            Clean History
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center">
                      <input
                        id="is_featured"
                        name="is_featured"
                        type="checkbox"
                        checked={selectedVehicle ? selectedVehicle.is_featured : newVehicle.is_featured}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                        Mark as Featured
                      </label>
                    </div>

                    {/* Image upload section */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images
                      </label>
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        {newVehicle.images.map((image, index) => renderImagePreview(image, index))}
                      </div>
                      <div className="mt-2">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-700 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Add Vehicle
                      </button>
                      <button
                        type="button"
                        onClick={closeAddModal}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
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
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Vehicle</h2>
            <form onSubmit={handleAddVehicleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                    Make
                  </label>
                  <input
                    type="text"
                    name="make"
                    id="make"
                    value={selectedVehicle.make}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                    Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    id="model"
                    value={selectedVehicle.model}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    id="year"
                    value={selectedVehicle.year}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={selectedVehicle.price}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">
                    Mileage
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    id="mileage"
                    value={selectedVehicle.mileage}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="vin" className="block text-sm font-medium text-gray-700">
                  VIN
                </label>
                <input
                  type="text"
                  name="vin"
                  id="vin"
                  value={selectedVehicle.vin}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="exteriorColor" className="block text-sm font-medium text-gray-700">
                    Exterior Color
                  </label>
                  <input
                    type="text"
                    name="exteriorColor"
                    id="exteriorColor"
                    value={selectedVehicle.exteriorColor}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="interiorColor" className="block text-sm font-medium text-gray-700">
                    Interior Color
                  </label>
                  <input
                    type="text"
                    name="interiorColor"
                    id="interiorColor"
                    value={selectedVehicle.interiorColor}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">
                    Transmission
                  </label>
                  <select
                    name="transmission"
                    id="transmission"
                    value={selectedVehicle.transmission}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Transmission</option>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                    <option value="cvt">CVT</option>
                    <option value="semi_automatic">Semi-Automatic</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700">
                    Body Type
                  </label>
                  <select
                    name="bodyType"
                    id="bodyType"
                    value={selectedVehicle.bodyType}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  >
                    <option value="">Select Body Type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="truck">Truck</option>
                    <option value="coupe">Coupe</option>
                    <option value="convertible">Convertible</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="minivan">Minivan</option>
                    <option value="van">Van</option>
                    <option value="wagon">Wagon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-700">
                    Fuel Type
                  </label>
                  <select
                    name="fuel_type"
                    id="fuel_type"
                    value={selectedVehicle.fuel_type}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="gasoline">Gasoline</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="plug_in_hybrid">Plug-in Hybrid</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="engine" className="block text-sm font-medium text-gray-700">
                    Engine
                  </label>
                  <input
                    type="text"
                    name="engine"
                    id="engine"
                    value={selectedVehicle.engine}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                    Condition
                  </label>
                  <select
                    name="condition"
                    id="condition"
                    value={selectedVehicle.condition}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Condition</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="certified_pre_owned">Certified Pre-Owned</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="stock_number" className="block text-sm font-medium text-gray-700">
                    Stock Number
                  </label>
                  <input
                    type="text"
                    name="stock_number"
                    id="stock_number"
                    value={selectedVehicle.stock_number}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={selectedVehicle.location}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={selectedVehicle.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>

              {/* Tags Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <div className="mt-2 flex flex-wrap gap-3">
                  <div className="flex items-center">
                    <input
                      id="tag-new"
                      name="tags"
                      type="checkbox"
                      value="new"
                      checked={selectedVehicle.tags.includes('new')}
                      onChange={handleTagChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tag-new" className="ml-2 block text-sm text-gray-700">
                      New Arrival
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="tag-featured"
                      name="tags"
                      type="checkbox"
                      value="featured"
                      checked={selectedVehicle.tags.includes('featured')}
                      onChange={handleTagChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tag-featured" className="ml-2 block text-sm text-gray-700">
                      Featured
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="tag-price-drop"
                      name="tags"
                      type="checkbox"
                      value="price-drop"
                      checked={selectedVehicle.tags.includes('price-drop')}
                      onChange={handleTagChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tag-price-drop" className="ml-2 block text-sm text-gray-700">
                      Price Drop
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="tag-low-mileage"
                      name="tags"
                      type="checkbox"
                      value="low-mileage"
                      checked={selectedVehicle.tags.includes('low-mileage')}
                      onChange={handleTagChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tag-low-mileage" className="ml-2 block text-sm text-gray-700">
                      Low Mileage
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="tag-certified"
                      name="tags"
                      type="checkbox"
                      value="certified"
                      checked={selectedVehicle.tags.includes('certified')}
                      onChange={handleTagChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tag-certified" className="ml-2 block text-sm text-gray-700">
                      Certified
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="tag-one-owner"
                      name="tags"
                      type="checkbox"
                      value="one-owner"
                      checked={selectedVehicle.tags.includes('one-owner')}
                      onChange={handleTagChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tag-one-owner" className="ml-2 block text-sm text-gray-700">
                      One Owner
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="tag-clean-history"
                      name="tags"
                      type="checkbox"
                      value="clean-history"
                      checked={selectedVehicle.tags.includes('clean-history')}
                      onChange={handleTagChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="tag-clean-history" className="ml-2 block text-sm text-gray-700">
                      Clean History
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {selectedVehicle.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Plus className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Submit and Cancel buttons */}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedVehicle(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;