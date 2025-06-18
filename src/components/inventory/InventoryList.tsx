import React, { useEffect, useState } from 'react';
import { getInventory, deleteVehicle } from '../../services/inventory';
import { Vehicle } from '../../types/vehicle';
import AddVehicleForm from './AddVehicleForm';

const InventoryList: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    sort_by: 'date_added',
    sort_order: 'desc',
    page: '1',
    limit: '10'
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      // Filter out empty values and convert to backend expected format
      const validFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      const response = await getInventory(validFilters);
      if (response.success && response.vehicles) {
        setVehicles(response.vehicles);
      } else {
        setError(response.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      setError('An error occurred while fetching vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (vehicleId: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await deleteVehicle(vehicleId);
        if (response.success) {
          setVehicles(vehicles.filter(v => v.id !== vehicleId));
          setError(null);
        } else {
          setError(response.error || 'Failed to delete vehicle');
        }
      } catch (err) {
        setError('An error occurred while deleting the vehicle');
      }
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditModal(true);
  };

  const handleEditComplete = () => {
    setShowEditModal(false);
    setSelectedVehicle(null);
    fetchVehicles(); // Refresh the list after edit
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Inventory Management</h1>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          className="border p-2 rounded"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
        <input
          type="text"
          placeholder="Status"
          className="border p-2 rounded"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        />
        <input
          type="text"
          placeholder="Sort By"
          className="border p-2 rounded"
          value={filters.sort_by}
          onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
        />
        <input
          type="text"
          placeholder="Sort Order"
          className="border p-2 rounded"
          value={filters.sort_order}
          onChange={(e) => setFilters({ ...filters, sort_order: e.target.value })}
        />
        <input
          type="text"
          placeholder="Page"
          className="border p-2 rounded"
          value={filters.page}
          onChange={(e) => setFilters({ ...filters, page: e.target.value })}
        />
        <input
          type="text"
          placeholder="Limit"
          className="border p-2 rounded"
          value={filters.limit}
          onChange={(e) => setFilters({ ...filters, limit: e.target.value })}
        />
      </div>

      {/* Vehicle List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="border rounded-lg overflow-hidden shadow-lg">
            {vehicle.images && vehicle.images[0] && (
              <img
                src={vehicle.images[0]}
                alt={`${vehicle.make} ${vehicle.model}`}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-gray-600 mb-2">Mileage: {vehicle.mileage.toLocaleString()} miles</p>
              <p className="text-green-600 font-bold mb-4">${vehicle.price.toLocaleString()}</p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(vehicle)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit Vehicle</h2>
            <AddVehicleForm
              initialData={selectedVehicle}
              onSuccess={handleEditComplete}
              onCancel={() => setShowEditModal(false)}
              isEditing={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList; 