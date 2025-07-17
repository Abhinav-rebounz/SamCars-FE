import React, { useState, useEffect } from 'react';
import { addVehicle, updateVehicle } from '../../services/inventory';
import { Vehicle } from '../../types/vehicle';

interface ExistingImage {
  id?: string;
  url: string;
  toDelete?: boolean;
}

interface AddVehicleFormProps {
  initialData?: Vehicle;
  onSuccess: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
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
    status: 'available',
    tags: [] as string[],
    images: [] as File[],
    carfax_link: '',
    fuel_type: '',
    engine: '',
    condition: '',
    features: [] as string[],
    location: '',
    stock_number: '',
    is_featured: false,
    sold_price: ''
  });

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
        make: initialData.make,
        model: initialData.model,
        year: initialData.year.toString(),
        price: initialData.price.toString(),
        mileage: initialData.mileage ? initialData.mileage.toString() : '',
        vin: initialData.vin || '',
        exterior_color: initialData.exterior_color || '',
        interior_color: initialData.interior_color || '',
        transmission: initialData.transmission || '',
        body_type: initialData.body_type || '',
        description: initialData.description || '',
        status: initialData.status || 'available',
        tags: initialData.tags || [],
        images: [],
        carfax_link: initialData.carfax_link || '',
        fuel_type: initialData.fuel_type || '',
        engine: initialData.engine || '',
        condition: initialData.condition || '',
        features: initialData.features || [],
        location: initialData.location || '',
        stock_number: initialData.stock_number || '',
        is_featured: initialData.is_featured || false,
        sold_price: initialData.sold_price || ''
      });
      
      // Load existing images for edit - handle both string array and object array formats
      if (initialData.images && Array.isArray(initialData.images)) {
        const processedImages = initialData.images.map((img: any, index: number) => ({
          id: `existing-${index}`,
          url: typeof img === 'string' ? img : (img.url || img.image_url || ''),
          toDelete: false,
        })).filter(img => img.url); // Filter out any empty URLs
        setExistingImages(processedImages);
      } else {
        setExistingImages([]);
      }
      
      // Reset new images and previews
      setNewImages([]);
      setPreviewUrls([]);
      setImageLoadErrors(new Set());
    } else {
      // Reset form for new vehicle
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
        status: 'available',
        tags: [],
        images: [],
        carfax_link: '',
        fuel_type: '',
        engine: '',
        condition: '',
        features: [],
        location: '',
        stock_number: '',
        is_featured: false,
        sold_price: ''
      });
      setExistingImages([]);
      setNewImages([]);
      setPreviewUrls([]);
      setImageLoadErrors(new Set());
    }
    
    // Clear any previous error or success messages
    setError(null);
    setSuccess(null);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        // Only HTMLInputElement has 'checked'
        const checkbox = e.target as HTMLInputElement;
        const checked = checkbox.checked;
        if (name === 'tags') {
            const currentTags = formData.tags;
            if (checked) {
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
        } else if (name === 'features') {
            const currentFeatures = formData.features;
            if (checked) {
                setFormData(prev => ({
                    ...prev,
                    features: [...currentFeatures, value]
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    features: currentFeatures.filter(f => f !== value)
                }));
            }
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

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const toggleExistingImageForDeletion = (index: number) => {
    setExistingImages(prev => 
      prev.map((img, i) => 
        i === index ? { ...img, toDelete: !img.toDelete } : img
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); // Clear success message on new submission

    try {
      const formDataToSend = new FormData();

      // Append all fields except images
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'images') {
          if (key === 'tags' || key === 'features') {
            // Always send tags and features as JSON strings, even if empty
            formDataToSend.append(key, JSON.stringify(value || []));
          } else if (key === 'is_featured') {
            formDataToSend.append(key, value ? 'true' : 'false');
          } else {
            formDataToSend.append(key, value as string);
          }
        }
      });

      // Always append new images, if any
      newImages.forEach((file: File) => {
        formDataToSend.append('images', file);
      });

      // Add list of existing images to delete
      const imagesToDelete = existingImages
        .filter(img => img.toDelete)
        .map(img => img.url);
      
      if (imagesToDelete.length > 0) {
        formDataToSend.append('images_to_delete', JSON.stringify(imagesToDelete));
      }

      // Add list of existing images to keep
      const existingImagesToKeep = existingImages
        .filter(img => !img.toDelete)
        .map(img => img.url);
      
      if (existingImagesToKeep.length > 0) {
        formDataToSend.append('existing_images', JSON.stringify(existingImagesToKeep));
      }

      // Debug logging
      console.log('Form submission debug:', {
        isEditing,
        newImagesCount: newImages.length,
        existingImagesCount: existingImages.length,
        imagesToDeleteCount: imagesToDelete.length,
        formDataKeys: Object.keys(formData),
        newImages: newImages.map(f => ({ name: f.name, size: f.size, type: f.type }))
      });

      // Debug FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      if (isEditing && initialData) {
        formDataToSend.append('id', initialData.id.toString());
        console.log('Updating vehicle with ID:', initialData.id);
        const response = await updateVehicle(formDataToSend);
        console.log('Update response:', response);
        console.log('Response success:', response.success);
        console.log('Response error:', response.error);
        if (response.success) {
          setSuccess('Vehicle updated successfully!');
          onSuccess();
        } else {
          setError(response.error || 'Failed to update vehicle');
        }
      } else {
        console.log('Adding new vehicle');
        const response = await addVehicle(formDataToSend);
        console.log('Add response:', response);
        if (response.success) {
          setError(null); // Clear any previous error before closing
          onSuccess(); // Only call onSuccess, let parent handle the message and closing
        } else {
          setError(response.error || 'Failed to add vehicle');
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An error occurred while saving the vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Make</label>
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
          <label className="block text-sm font-medium text-gray-700">Model</label>
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
          <label className="block text-sm font-medium text-gray-700">Year</label>
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
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Mileage</label>
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
          <label className="block text-sm font-medium text-gray-700">VIN</label>
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
          <label className="block text-sm font-medium text-gray-700">Transmission</label>
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
          <label className="block text-sm font-medium text-gray-700">Body Type</label>
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
          <label className="block text-sm font-medium text-gray-700">Status</label>
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
            <option value="auction">Auction</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
          <select
            name="fuel_type"
            value={formData.fuel_type}
            onChange={handleInputChange}
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
          <label className="block text-sm font-medium text-gray-700">Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
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
          <label className="block text-sm font-medium text-gray-700">Features</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {['Bluetooth', 'Backup Camera', 'Navigation', 'Heated Seats', 'Sunroof', 'Remote Start', 'Blind Spot Monitor', 'Apple CarPlay', 'Android Auto'].map(feature => (
              <label key={feature} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="features"
                  value={feature}
                  checked={formData.features.includes(feature)}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                {feature}
              </label>
            ))}
          </div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock Number</label>
          <input
            type="text"
            name="stock_number"
            value={formData.stock_number}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleInputChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-gray-700">Mark as Featured</label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {['New Arrival', 'Featured', 'Price Drop', 'Low Mileage', 'Certified', 'One Owner', 'Clean History', 'Mark as Featured'].map(tag => (
            <label key={tag} className="inline-flex items-center">
              <input
                type="checkbox"
                name="tags"
                value={tag}
                checked={formData.tags.includes(tag)}
                onChange={handleInputChange}
                className="mr-2"
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

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
          
          {/* Existing Images Section */}
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
                        onLoad={() => {
                          setImageLoadErrors(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(idx);
                            return newSet;
                          });
                        }}
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Failed to load</span>
                      </div>
                    )}
                    <div className={`absolute bottom-2 left-2 text-white text-xs px-2 py-1 rounded ${
                      image.toDelete ? 'bg-red-600' : 'bg-gray-600'
                    }`}>
                      {image.toDelete ? 'To Delete' : 'Current'}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExistingImageForDeletion(idx);
                      }}
                      className={`absolute top-2 right-2 text-white p-1 rounded-full transition-colors duration-200 w-6 h-6 flex items-center justify-center text-xs ${
                        image.toDelete 
                          ? 'bg-green-500 hover:bg-green-600' 
                          : 'bg-red-500 hover:bg-red-600'
                      }`}
                      title={image.toDelete ? 'Keep this image' : 'Mark for deletion'}
                    >
                      {image.toDelete ? '✓' : '×'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Section */}
          {previewUrls.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-600 mb-2">
                New Images (will be added to existing images)
              </h4>
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
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200 w-6 h-6 flex items-center justify-center text-xs"
                      title="Remove image"
                    >
                      ×
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

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
};

export default AddVehicleForm; 