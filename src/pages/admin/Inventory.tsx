import {
  ChevronDown,
  ChevronUp,
  Edit,
  Filter,
  Plus,
  Search,
  Trash2
} from 'lucide-react';
import React, { useState } from 'react';
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';
import { vehicles as initialVehicles } from '../../data/vehicles'; // Renamed to avoid conflict
import api from '../../services/api';

// Define a type for your vehicle data for better type safety
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
  images: string[]; // URLs of images
  dateAdded: string;
}

const Inventory: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles); // Use state to manage vehicles
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('dateAdded');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null); // Renamed to avoid confusion with actual vehicle object

  // State for the new vehicle form
  const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id' | 'isSold' | 'dateAdded' | 'images'> & { images: File[] }>({
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
    images: []
  });
  const [addFormError, setAddFormError] = useState<string | null>(null);
  const [addFormSuccess, setAddFormSuccess] = useState<string | null>(null);


  // Filter vehicles based on search term
  const filteredVehicles = vehicles.filter(vehicle => {
    const searchString = `${vehicle.make} ${vehicle.model} ${vehicle.year} ${vehicle.vin}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a];
    let bValue: any = b[sortField as keyof typeof b];

    // Handle date strings
    if (sortField === 'dateAdded') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
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

  const handleDelete = (id: string) => {
    setSelectedVehicleId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call an API to delete the vehicle
    console.log(`Vehicle ${selectedVehicleId} would be deleted`);
    // Optimistically update UI or re-fetch from API
    setVehicles(prevVehicles => prevVehicles.filter(v => v.id !== selectedVehicleId));
    setShowDeleteModal(false);
    setSelectedVehicleId(null);
  };

  // Handler for all text/number inputs and select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({ ...prev, [name]: value }));
  };

  // Handler for checkbox inputs (tags)
  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setNewVehicle(prev => {
      const newTags = checked
        ? [...prev.tags, value]
        : prev.tags.filter(tag => tag !== value);
      return { ...prev, tags: newTags };
    });
  };

  // Handler for file input (images)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to Array and update state
      setNewVehicle(prev => ({ ...prev, images: Array.from(e.target.files) }));
    }
  };

  // Handler for submitting the new vehicle form
  const handleAddVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError(null);
    setAddFormSuccess(null);

    // Basic client-side validation
    if (!newVehicle.make || !newVehicle.model || !newVehicle.year || !newVehicle.price || !newVehicle.vin || newVehicle.images.length === 0) {
      setAddFormError('Please fill in all required fields and upload at least one image.');
      return;
    }

    if (newVehicle.images.length > 10) {
        setAddFormError('You can upload a maximum of 10 images.');
        return;
    }

    const formData = new FormData();
    formData.append('make', newVehicle.make);
    formData.append('model', newVehicle.model);
    formData.append('year', newVehicle.year.toString());
    formData.append('price', newVehicle.price.toString());
    formData.append('mileage', newVehicle.mileage.toString());
    formData.append('vin', newVehicle.vin);
    formData.append('exterior_color', newVehicle.exteriorColor);
    formData.append('interior_color', newVehicle.interiorColor);
    formData.append('transmission', newVehicle.transmission.toLowerCase());
    formData.append('body_type', newVehicle.bodyType.toLowerCase());
    formData.append('description', newVehicle.description);
    formData.append('tags', JSON.stringify(newVehicle.tags));

    // Append each selected image file
    newVehicle.images.forEach(image => {
      formData.append('images', image); // 'images' must match the Multer field name
    });

    try {
      console.log(localStorage.getItem('token'));
      const response = await api.post(API_BASE_URL + API_ENDPOINTS.ADD_NEW_VEHICLE, formData,{ // Adjust URL as needed
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('token') || ''
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add vehicle.');
      }

      const responseData = await response.json();
      setAddFormSuccess('Vehicle added successfully!');
      // Assuming the backend returns the newly added vehicle or a success message
      console.log('Vehicle added:', responseData);

      // Optionally, refetch vehicles or add the new vehicle to state
      // For simplicity, we'll just close the modal and reset the form
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
        images: []
      });
      // A more robust solution would be to re-fetch the inventory or add the new vehicle object returned from the API
      // For now, we'll simulate adding it if the structure matches and then close the modal.
      // In a real app, you'd update your `vehicles` state with the `responseData.vehicle` if it's returned.
      // For now, let's just close the modal and let the user re-open it to see potential changes.
      setTimeout(() => {
        setShowAddModal(false);
        setAddFormSuccess(null); // Clear success message
        // You might want to re-fetch the vehicle list here to display the new item
        // e.g., fetchVehicles();
      }, 2000);

    } catch (error: any) {
      setAddFormError(error.message || 'An unexpected error occurred.');
      console.error('Error adding vehicle:', error);
    }
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewVehicle({ // Reset form when closing
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
      images: []
    });
    setAddFormError(null);
    setAddFormSuccess(null);
  };


  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
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
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-400 mr-2" />
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option value="">All Vehicles</option>
                <option value="new">New Arrivals</option>
                <option value="featured">Featured</option>
                <option value="price-drop">Price Drop</option>
                <option value="sold">Sold</option>
              </select>
            </div>

            <div>
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
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
                    {sortField === 'dateAdded' && (
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
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={vehicle.images[0]}
                          alt={`${vehicle.make} ${vehicle.model}`}
                        />
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
                    <button className="text-blue-700 hover:text-blue-800 mr-3">
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
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                <span className="font-medium">{vehicles.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <ChevronUp className="h-5 w-5 rotate-90" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-blue-500 bg-blue-50 text-sm font-medium text-blue-700">
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  8
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  9
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  10
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-5 w-5 rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

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
                          value={newVehicle.make}
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
                          value={newVehicle.model}
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
                          value={newVehicle.year}
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
                          value={newVehicle.price}
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
                          value={newVehicle.mileage}
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
                        value={newVehicle.vin}
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
                          value={newVehicle.exteriorColor}
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
                          value={newVehicle.interiorColor}
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
                          id="transmission"
                          name="transmission"
                          value={newVehicle.transmission}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Select Transmission</option>
                          <option value="Automatic">Automatic</option>
                          <option value="Manual">Manual</option>
                          <option value="CVT">CVT</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700">
                          Body Type
                        </label>
                        <select
                          id="bodyType"
                          name="bodyType"
                          value={newVehicle.bodyType}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Select Body Type</option>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Truck">Truck</option>
                          <option value="Coupe">Coupe</option>
                          <option value="Convertible">Convertible</option>
                          <option value="Wagon">Wagon</option>
                          <option value="Van">Van</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={newVehicle.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <div className="mt-2 flex items-center space-x-3">
                        <div className="flex items-center">
                          <input
                            id="tag-new"
                            name="tags"
                            type="checkbox"
                            value="new"
                            checked={newVehicle.tags.includes('new')}
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
                            checked={newVehicle.tags.includes('featured')}
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
                            checked={newVehicle.tags.includes('price-drop')}
                            onChange={handleTagChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="tag-price-drop" className="ml-2 block text-sm text-gray-700">
                            Price Drop
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Upload Images
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-700 hover:text-blue-800 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>Upload files</span>
                              <input
                                id="file-upload"
                                name="images" // Match this name to Multer's 'images' field
                                type="file"
                                className="sr-only"
                                multiple
                                onChange={handleFileChange}
                                accept="image/jpeg,image/png,image/gif,image/webp"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF, WEBP up to 5MB each (max 10 files)
                          </p>
                          {newVehicle.images.length > 0 && (
                            <div className="mt-2 text-sm text-gray-900">
                              Selected files: {newVehicle.images.map(file => file.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit" // Change to type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-700 text-base font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Add Vehicle
                      </button>
                      <button
                        type="button" // Keep as type="button" to prevent form submission
                        onClick={closeAddModal} // Use the new close function
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

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

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
    </div>
  );
};

export default Inventory;