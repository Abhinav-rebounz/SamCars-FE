import React, { useState, useRef, useEffect } from 'react';
import { addAuctionPurchase, updateAuctionPurchase } from '../../services/auction';

interface AuctionPurchaseFormProps {
  formRef: React.RefObject<HTMLFormElement>;
  onSuccess?: () => void;
  initialData?: any; // For editing existing auction purchase
}

const AuctionPurchaseForm: React.FC<AuctionPurchaseFormProps> = ({ formRef, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    // Vehicle fields
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    vin: '',
    exterior_color: '',
    interior_color: '',
    transmission: '',
    body_type: '',
    description: '',
    status: 'auction',
    condition: 'used',
    fuel_type: '',
    tags: [] as string[],
    // Auction fields
    purchase_date: '',
    purchase_price: '',
    additional_costs: '',
    list_price: '',
    sold_price: '',
    notes: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        make: initialData.make || '',
        model: initialData.model || '',
        year: initialData.year?.toString() || '',
        price: initialData.price?.toString() || '',
        mileage: initialData.mileage?.toString() || '',
        vin: initialData.vin || '',
        exterior_color: initialData.exterior_color || '',
        interior_color: initialData.interior_color || '',
        transmission: initialData.transmission || '',
        body_type: initialData.body_type || '',
        description: initialData.description || '',
        status: initialData.status || 'auction',
        condition: initialData.condition || 'used',
        fuel_type: initialData.fuel_type || '',
        tags: initialData.tags || [],
        purchase_date: initialData.purchase_date || '',
        purchase_price: initialData.purchase_price?.toString() || '',
        additional_costs: initialData.additional_costs?.toString() || '',
        list_price: initialData.list_price?.toString() || '',
        sold_price: initialData.sold_price?.toString() || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name === 'tags') {
        const currentTags = formData.tags;
        if (checkbox.checked) {
          setFormData(prev => ({
            ...prev,
            tags: [...currentTags, value]
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            tags: currentTags.filter(tag => tag !== value)
          }));
        }
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const purchaseData = new FormData();

      // Only send non-empty fields to avoid Multer "Too many fields" error
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          // Skip: images are handled separately below
          return;
        } else if (Array.isArray(value)) {
          // Only send arrays if they have content
          if (value.length > 0) {
            purchaseData.append(key, JSON.stringify(value));
          }
        } else if (value !== undefined && value !== null) {
          // Send all values (including empty strings) for proper validation
          purchaseData.append(key, value);
        }
      });

      // Add images
      images.forEach((image, index) => {
        purchaseData.append('images', image);
      });

      console.log('Sending auction purchase data:', Object.fromEntries(purchaseData.entries()));

      // Use the auction service functions instead of direct fetch
      let response;
      if (initialData) {
        response = await updateAuctionPurchase(initialData.id, purchaseData);
      } else {
        response = await addAuctionPurchase(purchaseData);
      }

      if (response.success) {
        console.log(`Auction purchase ${initialData ? 'updated' : 'added'} successfully:`, response);
        setSuccess(true);
        
        // Reset form only if not editing
        if (!initialData) {
          setFormData({
            make: '',
            model: '',
            year: '',
            price: '',
            mileage: '',
            vin: '',
            exterior_color: '',
            interior_color: '',
            transmission: '',
            body_type: '',
            description: '',
            status: 'auction',
            condition: 'used',
            fuel_type: '',
            tags: [],
            purchase_date: '',
            purchase_price: '',
            additional_costs: '',
            list_price: '',
            sold_price: '',
            notes: '',
          });
          setImages([]);
        }
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error(response.error || `Failed to ${initialData ? 'update' : 'add'} auction purchase`);
      }
    } catch (err) {
      console.error(`Error ${initialData ? 'updating' : 'adding'} auction purchase:`, err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {success && <div className="text-green-500 p-2 bg-green-50 rounded">
        Auction purchase {initialData ? 'updated' : 'added'} successfully!
      </div>}
      {error && (
        <div className="text-red-500 p-2 bg-red-50 rounded border border-red-200">
          <div className="font-medium">Please fix the following error:</div>
          <div className="mt-1">{error}</div>
          {error.includes('required') && (
            <div className="mt-2 text-sm text-red-600">
              Please fill in all required fields marked with * before submitting.
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Information Section */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vehicle Information</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Make *</label>
          <input
            type="text"
            name="make"
            value={formData.make}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Model *</label>
          <input
            type="text"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Year *</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            min="1900"
            max={new Date().getFullYear() + 1}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">VIN</label>
          <input
            type="text"
            name="vin"
            value={formData.vin}
            onChange={handleInputChange}
            maxLength={17}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Mileage</label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleInputChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Exterior Color</label>
          <input
            type="text"
            name="exterior_color"
            value={formData.exterior_color}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Interior Color</label>
          <input
            type="text"
            name="interior_color"
            value={formData.interior_color}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Transmission *</label>
          <select
            name="transmission"
            value={formData.transmission}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select transmission</option>
            <option value="automatic">automatic</option>
            <option value="manual">manual</option>
            <option value="cvt">cvt</option>
            <option value="semi_automatic">semi_automatic</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Body Type *</label>
          <select
            name="body_type"
            value={formData.body_type}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select body type</option>
            <option value="sedan">sedan</option>
            <option value="suv">suv</option>
            <option value="truck">truck</option>
            <option value="coupe">coupe</option>
            <option value="convertible">convertible</option>
            <option value="hatchback">hatchback</option>
            <option value="minivan">minivan</option>
            <option value="van">van</option>
            <option value="wagon">wagon</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Condition *</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select condition</option>
            <option value="new">new</option>
            <option value="used">used</option>
            <option value="certified_pre_owned">certified_pre_owned</option>
            <option value="excellent">excellent</option>
            <option value="good">good</option>
            <option value="fair">fair</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Fuel Type *</label>
          <select
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select fuel type</option>
            <option value="gasoline">gasoline</option>
            <option value="diesel">diesel</option>
            <option value="electric">electric</option>
            <option value="hybrid">hybrid</option>
            <option value="plug_in_hybrid">plug_in_hybrid</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {['featured', 'new', 'used', 'certified'].map(tag => (
              <label key={tag} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  checked={formData.tags.includes(tag)}
                  onChange={handleInputChange}
                  className="mr-2"
                  disabled={loading}
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        {/* Auction Information Section */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Auction Information</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Date *</label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Price *</label>
          <input
            type="number"
            name="purchase_price"
            value={formData.purchase_price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Costs</label>
          <input
            type="number"
            name="additional_costs"
            value={formData.additional_costs}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">List Price</label>
          <input
            type="number"
            name="list_price"
            value={formData.list_price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Sold Price</label>
          <input
            type="number"
            name="sold_price"
            value={formData.sold_price}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Vehicle Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            setFormData({
              make: '',
              model: '',
              year: '',
              price: '',
              mileage: '',
              vin: '',
              exterior_color: '',
              interior_color: '',
              transmission: '',
              body_type: '',
              description: '',
              status: 'auction',
              condition: 'used',
              fuel_type: '',
              tags: [],
              purchase_date: '',
              purchase_price: '',
              additional_costs: '',
              list_price: '',
              sold_price: '',
              notes: '',
            });
            setImages([]);
            setError('');
            setSuccess(false);
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clear Form
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (initialData ? 'Update Auction Purchase' : 'Add Auction Purchase')}
        </button>
      </div>
    </form>
  );
};

export default AuctionPurchaseForm; 