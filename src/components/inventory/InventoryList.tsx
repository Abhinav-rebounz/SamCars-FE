import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AddVehicleFormProps {
  initialData?: any;
  onSuccess: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

interface ExistingImage {
  id?: string;
  url: string;
  toDelete?: boolean;
}

const AddVehicleForm: React.FC<AddVehicleFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    carfax_link: '',
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (initialData) {
      setFormData({
        make: initialData.make || '',
        model: initialData.model || '',
        year: initialData.year || '',
        price: initialData.price || '',
        mileage: initialData.mileage || '',
        carfax_link: initialData.carfax_link || '',
      });

      // Handle existing images
      if (initialData.images && Array.isArray(initialData.images)) {
        const processedImages = initialData.images.map((img: any, index: number) => ({
          id: img.id || `existing-${index}`,
          url: typeof img === 'string' ? img : img.url,
          toDelete: false,
        }));
        setExistingImages(processedImages);
      }
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
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

  const toggleExistingImageForDeletion = (index: number) => {
    setExistingImages(prev => 
      prev.map((img, i) => 
        i === index ? { ...img, toDelete: !img.toDelete } : img
      )
    );
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const imagesToDelete = existingImages
      .filter(img => img.toDelete)
      .map(img => img.id);
    
    const submissionData = {
      ...formData,
      newImages,
      imagesToDelete,
      existingImages: existingImages.filter(img => !img.toDelete),
    };
    
    console.log('Submitting:', submissionData);
    onSuccess();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="Enter make"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Enter model"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="Enter year"
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mileage</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              placeholder="Enter mileage"
              min="0"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Carfax Link</label>
          <input
            type="url"
            name="carfax_link"
            value={formData.carfax_link}
            onChange={handleChange}
            placeholder="Enter Carfax link"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Select multiple images to upload. Supported formats: JPG, PNG, GIF
          </p>
        </div>

        {/* Image Previews */}
        {(existingImages.length > 0 || previewUrls.length > 0) && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">Image Preview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Existing images */}
              {existingImages.map((image, idx) => (
                <div
                  key={`existing-${idx}`}
                  className={`relative group ${image.toDelete ? 'opacity-50' : ''}`}
                >
                  {!imageLoadErrors.has(idx) ? (
                    <img
                      src={image.url}
                      alt={`Existing vehicle image ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
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
                  
                  <button
                    type="button"
                    onClick={() => toggleExistingImageForDeletion(idx)}
                    className={`absolute top-2 right-2 p-1 rounded-full ${
                      image.toDelete 
                        ? 'bg-red-500 text-white' 
                        : 'bg-black bg-opacity-50 text-white hover:bg-opacity-75'
                    } transition-all duration-200`}
                    title={image.toDelete ? 'Restore image' : 'Mark for deletion'}
                  >
                    <X size={16} />
                  </button>
                  
                  {image.toDelete && (
                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                      <span className="text-red-700 font-medium text-sm">Will be deleted</span>
                    </div>
                  )}
                </div>
              ))}

              {/* New image previews */}
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
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    New
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            {isEditing ? 'Update Vehicle' : 'Add Vehicle'}
          </button>
          <button
            type="button"
            className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicleForm;