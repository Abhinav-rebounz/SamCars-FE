import React, { useState, useEffect, useCallback } from 'react';
import { addAuctionPurchase, updateAuctionPurchase } from '../../services/auction';
import { X } from 'lucide-react';

interface ExistingImage {
  id?: string;
  url: string;
  toDelete?: boolean;
}

interface FormData {
  // Vehicle fields
  make: string;
  model: string;
  year: string;
  mileage: string;
  vin: string;
  exterior_color: string;
  interior_color: string;
  transmission: string;
  body_type: string;
  description: string;
  status: string;
  condition: string;
  fuel_type: string;
  tags: string[];
  carfax_link: string;
  // Auction fields
  purchase_date: string;
  purchase_price: string;
  additional_costs: string;
  list_price: string;
  sold_price: string;
  notes: string;
  features: string[];
  engine: string;
  location: string;
  stock_number: string;
  is_featured: boolean;
}

interface AuctionPurchaseFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  make: '',
  model: '',
  year: '',
  mileage: '',
  vin: '',
  exterior_color: '',
  interior_color: '',
  transmission: '',
  body_type: '',
  description: '',
  status: 'reserved', // Changed from 'auction' to 'reserved'
  condition: 'used',
  fuel_type: '',
  tags: [],
  carfax_link: '',
  purchase_date: new Date().toISOString().split('T')[0],
  purchase_price: '',
  additional_costs: '',
  list_price: '',
  sold_price: '',
  notes: '',
  features: [],
  engine: '',
  location: '',
  stock_number: '',
  is_featured: false
};

const AuctionPurchaseForm: React.FC<AuctionPurchaseFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...INITIAL_FORM_DATA,
        ...initialData,
        year: initialData.year?.toString() || '',
        mileage: initialData.mileage?.toString() || '',
        purchase_price: initialData.purchase_price?.toString() || '',
        additional_costs: initialData.additional_costs?.toString() || '',
        list_price: initialData.list_price?.toString() || '',
        sold_price: initialData.sold_price?.toString() || '',
        purchase_date: initialData.purchase_date ? new Date(initialData.purchase_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        tags: Array.isArray(initialData.tags) ? initialData.tags : [],
        features: Array.isArray(initialData.features) ? initialData.features : [],
        is_featured: initialData.is_featured || false
      });

      if (initialData.images && Array.isArray(initialData.images)) {
        const processedImages = initialData.images
          .map((img: any, index: number) => ({
            id: `existing-${index}`,
            url: typeof img === 'string' ? img : (img.url || img.image_url || ''),
            toDelete: false,
          }))
          .filter((img: ExistingImage) => img.url);
        setExistingImages(processedImages);
      }
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const checked = checkbox.checked;
      if (name === 'tags') {
        setFormData(prev => ({
          ...prev,
          tags: checked 
            ? [...prev.tags, value]
            : prev.tags.filter(tag => tag !== value)
        }));
      } else if (name === 'features') {
        setFormData(prev => ({
          ...prev,
          features: checked 
            ? [...prev.features, value]
            : prev.features.filter(feature => feature !== value)
        }));
      } else if (name === 'is_featured') {
        setFormData(prev => ({
          ...prev,
          is_featured: checked
        }));
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
      const filesArray = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...filesArray]);
      const urls = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  const removeNewImage = (index: number) => {
    const urlToRevoke = previewUrls[index];
    URL.revokeObjectURL(urlToRevoke);
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageError = (index: number, type: 'existing' | 'new') => {
    if (type === 'existing') {
      setImageLoadErrors(prev => new Set(prev).add(index));
    }
  };

  const toggleExistingImageForDeletion = (index: number) => {
    setExistingImages(prev => 
      prev.map((img, i) => 
        i === index ? { ...img, toDelete: !img.toDelete } : img
      )
    );
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formDataToSend = new FormData();

      console.log('Form data before submission:', formData);

      // Append all fields except images
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          if (key === 'tags' || key === 'features') {
            formDataToSend.append(key, JSON.stringify(value || []));
          } else if (key === 'is_featured') {
            formDataToSend.append(key, value ? 'true' : 'false');
          } else {
            formDataToSend.append(key, value as string);
          }
        }
      });

      // Append new images
      newImages.forEach((file: File) => {
        formDataToSend.append('images', file);
      });

      // Handle existing images
      const imagesToDelete = existingImages
        .filter(img => img.toDelete)
        .map(img => img.url);
      
      if (imagesToDelete.length > 0) {
        formDataToSend.append('images_to_delete', JSON.stringify(imagesToDelete));
      }

      const existingImagesToKeep = existingImages
        .filter(img => !img.toDelete)
        .map(img => img.url);
      
      if (existingImagesToKeep.length > 0) {
        formDataToSend.append('existing_images', JSON.stringify(existingImagesToKeep));
      }

      // Debug FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      if (isEditing && initialData?.id) {
        formDataToSend.append('id', initialData.id.toString());
        const response = await updateAuctionPurchase(formDataToSend);
        if (response.success) {
          setSuccess('Auction purchase updated successfully!');
          onSuccess();
        } else {
          setError(response.error || 'Failed to update auction purchase');
        }
      } else {
        const response = await addAuctionPurchase(formDataToSend);
        console.log('Add auction purchase response:', response);
        if (response.success) {
          setSuccess('Auction purchase added successfully!');
          onSuccess();
        } else {
          setError(response.error || 'Failed to add auction purchase');
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An error occurred while saving the auction purchase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-7xl mx-auto">
      {error && (
        <div className="text-red-500 p-2 bg-red-50 rounded flex justify-between items-center">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Auction Purchase Details */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Auction Purchase Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
            <input
              type="number"
              name="purchase_price"
              value={formData.purchase_price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Sold Price</label>
            <input
              type="number"
              name="sold_price"
              value={formData.sold_price}
              onChange={(e) => {
                const value = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  sold_price: value,
                  status: value && parseFloat(value) > 0 ? 'sold' : prev.status
                }));
              }}
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Make *</label>
          <input
            type="text"
            name="make"
            value={formData.make}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year *</label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mileage *</label>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleInputChange}
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">VIN *</label>
          <input
            type="text"
            name="vin"
            value={formData.vin}
            onChange={handleInputChange}
            required
            maxLength={17}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Number *</label>
          <input
            type="text"
            name="stock_number"
            value={formData.stock_number}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          >
            <option value="">Select transmission</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
            <option value="cvt">CVT</option>
            <option value="semi_automatic">Semi-Automatic</option>
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
          >
            <option value="">Select body type</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="coupe">Coupe</option>
            <option value="convertible">Convertible</option>
            <option value="hatchback">Hatchback</option>
            <option value="minivan">Minivan</option>
            <option value="van">Van</option>
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
          >
            <option value="">Select fuel type</option>
            <option value="gasoline">Gasoline</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
            <option value="plug_in_hybrid">Plug-in Hybrid</option>
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
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="certified_pre_owned">Certified Pre-Owned</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
            <option value="maintenance">Maintenance</option>
            <option value="reserved">Reserved</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Carfax Report Link</label>
          <input
            type="url"
            name="carfax_link"
            value={formData.carfax_link}
            onChange={handleInputChange}
            placeholder="https://www.carfax.com/vehicle/..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Engine</label>
          <input
            type="text"
            name="engine"
            value={formData.engine}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Featured checkbox */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          name="is_featured"
          checked={formData.is_featured}
          onChange={handleInputChange}
          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
        />
        <label className="text-sm font-medium text-gray-700">Mark as Featured</label>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['Bluetooth', 'Backup Camera', 'Navigation', 'Heated Seats', 'Sunroof', 'Remote Start', 'Blind Spot Monitor', 'Apple CarPlay', 'Android Auto'].map(feature => (
            <label key={feature} className="inline-flex items-center">
              <input
                type="checkbox"
                name="features"
                value={feature}
                checked={formData.features.includes(feature)}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
              />
              <span className="text-sm text-gray-700">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {['New Arrival', 'Featured', 'Price Drop', 'Low Mileage', 'Certified', 'One Owner', 'Clean History'].map(tag => (
            <label key={tag} className="inline-flex items-center">
              <input
                type="checkbox"
                name="tags"
                value={tag}
                checked={formData.tags.includes(tag)}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mr-2"
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Add any additional notes about the auction purchase..."
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full"
        />
        <p className="text-sm text-gray-500 mt-1">
          {isEditing 
            ? "Select new images to add to existing images. Use the × button on existing images to remove them."
            : "Select multiple images to upload. Supported formats: JPG, PNG, GIF"
          }
        </p>
      </div>

      {/* Image Preview */}
      {(existingImages.length > 0 || previewUrls.length > 0) && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">Image Preview</h3>
          
          {isEditing && existingImages.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Image Management:</strong> New images will be added to your existing images. 
                To remove existing images, click the × button on them. Images marked with red border will be deleted.
              </p>
            </div>
          )}
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Current Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((image, idx) => (
                  <div key={`existing-${idx}`} className="relative group">
                    {!imageLoadErrors.has(idx) ? (
                      <img
                        src={image.url}
                        alt={`Existing vehicle image ${idx + 1}`}
                        className={`w-full h-32 object-cover rounded-lg border-2 ${
                          image.toDelete ? 'border-red-300 opacity-50' : 'border-gray-200'
                        }`}
                        onError={() => handleImageError(idx, 'existing')}
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Failed to load</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleExistingImageForDeletion(idx)}
                      className={`absolute top-2 right-2 p-1 rounded-full ${
                        image.toDelete 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : 'bg-red-500 text-white hover:bg-red-600'
                      } transition-colors duration-200`}
                      title={image.toDelete ? 'Keep image' : 'Remove image'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className={`absolute bottom-2 left-2 text-xs px-2 py-1 rounded ${
                      image.toDelete ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {image.toDelete ? 'To Delete' : 'Current'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {previewUrls.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-2">New Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewUrls.map((url, idx) => (
                  <div key={`preview-${idx}`} className="relative group">
                    <img
                      src={url}
                      alt={`New vehicle image ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Auction Purchase' : 'Add Auction Purchase'}
        </button>
      </div>
    </form>
  );
};

export default AuctionPurchaseForm; 