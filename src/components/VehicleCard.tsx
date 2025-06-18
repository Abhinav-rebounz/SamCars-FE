import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Gauge } from 'lucide-react';

interface VehicleCardProps {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image?: string;
  condition?: string;
  tags: string[];
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  make,
  model,
  year,
  price,
  mileage,
  image,
  condition,
  tags
}) => {
  const defaultImage = 'https://via.placeholder.com/400x250?text=No+Image';

  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2">
            {tags.includes('New Arrivals') && (
              <span className="tag tag-new">New</span>
            )}
            {tags.includes('Featured Vehicles') && (
              <span className="tag tag-featured">Featured</span>
            )}
            {tags.includes('On Sale') && (
              <span className="tag tag-sale">Sale</span>
            )}
            {tags.includes('Low Mileage') && (
              <span className="tag tag-low-mileage">Low Mileage</span>
            )}
            {tags.includes('Certified Pre-Owned') && (
              <span className="tag tag-certified">Certified</span>
            )}
          </div>
        )}
        
        {/* Image */}
        <Link to={`/inventory/${id}`}>
          <img 
            src={image || defaultImage} 
            alt={`${year} ${make} ${model}`} 
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
        </Link>
      </div>
      
      <div className="p-4">
        {/* Title */}
        <Link to={`/inventory/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition-colors">
            {year} {make} {model}
          </h3>
        </Link>
        
        {/* Price */}
        <div className="mt-2 mb-3">
          <span className="text-xl font-bold text-blue-700">
            ${price.toLocaleString()}
          </span>
        </div>
        
        {/* Details */}
        <div className="flex flex-wrap gap-y-2">
          <div className="w-full sm:w-1/2 flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="text-sm">{year}</span>
          </div>
          <div className="w-full sm:w-1/2 flex items-center text-gray-600">
            <Gauge className="h-4 w-4 mr-1" />
            <span className="text-sm">{mileage.toLocaleString()} mi</span>
          </div>
          {condition && (
            <div className="w-full flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{condition} Condition</span>
            </div>
          )}
        </div>
        
        {/* Button */}
        <div className="mt-4">
          <Link 
            to={`/inventory/${id}`} 
            className="btn-outline w-full text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;