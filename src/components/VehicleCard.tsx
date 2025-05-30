import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Gauge } from 'lucide-react';

interface VehicleCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  condition: string;
  tags: ('new' | 'featured' | 'price-drop')[];
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
  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-2">
            {tags.includes('new') && (
              <span className="tag tag-new">New</span>
            )}
            {tags.includes('featured') && (
              <span className="tag tag-featured">Featured</span>
            )}
            {tags.includes('price-drop') && (
              <span className="tag tag-price-drop">Price Drop</span>
            )}
          </div>
        )}
        
        {/* Image */}
        <Link to={`/inventory/${id}`}>
          <img 
            src={image} 
            alt={`${year} ${make} ${model}`} 
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
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
          <div className="w-full flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{condition} Condition</span>
          </div>
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