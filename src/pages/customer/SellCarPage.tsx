import React, { useState } from 'react';
import { Car, Upload, Info, X } from 'lucide-react';

const SellCarPage: React.FC = () => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    exteriorColor: '',
    interiorColor: '',
    vin: '',
    transmission: '',
    fuelType: '',
    bodyType: '',
    description: '',
    askingPrice: '',
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    availableTime: '',
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 10;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    // Filter files
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not a supported image type`);
        return false;
      }
      if (file.size > maxSize) {
        alert(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    // Check total number of files
    if (selectedImages.length + validFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`);
      return;
    }

    // Create preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));

    setSelectedImages(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]); // Clean up URL object
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data and images to the server
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        make: '',
        model: '',
        year: '',
        mileage: '',
        exteriorColor: '',
        interiorColor: '',
        vin: '',
        transmission: '',
        fuelType: '',
        bodyType: '',
        description: '',
        askingPrice: '',
        name: '',
        email: '',
        phone: '',
        preferredContact: 'email',
        availableTime: '',
      });
      // Clean up preview URLs
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setSelectedImages([]);
      setPreviewUrls([]);
    }, 3000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Sell Your Car
            </h1>
            <p className="text-xl mb-0">
              Get a competitive offer for your vehicle. Quick, easy, and hassle-free process.
            </p>
          </div>
        </div>
      </section>

      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-700 mb-3">
                <Car className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Vehicle Details</h3>
              <p className="text-gray-600 text-sm">
                Provide accurate information about your car
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-700 mb-3">
                <Upload className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Photos</h3>
              <p className="text-gray-600 text-sm">
                Upload clear photos of your vehicle
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-700 mb-3">
                <Info className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Get an Offer</h3>
              <p className="text-gray-600 text-sm">
                We'll contact you with our best offer
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Vehicle Information</h2>

            {formSubmitted ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                <h3 className="font-semibold mb-1">Submission Successful!</h3>
                <p>Thank you for submitting your vehicle information. Our team will review the details and contact you shortly with an offer.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Photos */}
                <div>
                  <label className="form-label">Vehicle Photos</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-center w-full">
                      <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-gray-700 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500">
                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">Click to upload photos</span>
                        <span className="text-xs text-gray-500 mt-1">JPG, PNG, WebP up to 5MB (max 10 photos)</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>

                    {/* Image Previews */}
                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Vehicle preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Make</label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="form-label">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Year</label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="form-label">Mileage</label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="form-label">VIN (Optional)</label>
                    <input
                      type="text"
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Exterior Color</label>
                    <input
                      type="text"
                      name="exteriorColor"
                      value={formData.exteriorColor}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="form-label">Interior Color</label>
                    <input
                      type="text"
                      name="interiorColor"
                      value={formData.interiorColor}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Transmission</label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="">Select</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Fuel Type</label>
                    <select
                      name="fuelType"
                      value={formData.fuelType}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="">Select</option>
                      <option value="Gasoline">Gasoline</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Body Type</label>
                    <select
                      name="bodyType"
                      value={formData.bodyType}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="">Select</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Truck">Truck</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Van">Van</option>
                      <option value="Wagon">Wagon</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Vehicle Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="Please provide any additional details about your vehicle's condition, features, or history..."
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  ></textarea>
                </div>

                <div>
                  <label className="form-label">Asking Price ($)</label>
                  <input
                    type="number"
                    name="askingPrice"
                    value={formData.askingPrice}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <label className="form-label">Preferred Contact Method</label>
                      <select
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="form-label">Best Time to Contact</label>
                    <input
                      type="text"
                      name="availableTime"
                      value={formData.availableTime}
                      onChange={handleChange}
                      placeholder="e.g., Weekdays after 5 PM"
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn-primary">
                    Submit Vehicle Information
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellCarPage;