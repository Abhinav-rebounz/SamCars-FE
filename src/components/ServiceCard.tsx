import React from 'react';
import { Clock } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  onSelect: (id: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  name,
  description,
  price,
  duration,
  image,
  onSelect
}) => {
  return (
    <div className="card">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {name}
        </h3>
        
        <div className="mt-2 mb-3 flex justify-between items-center">
          <span className="text-xl font-bold text-blue-700">
            ${price.toFixed(2)}
          </span>
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">{duration}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          {description}
        </p>
        
        <button 
          onClick={() => onSelect(id)} 
          className="btn-primary w-full"
        >
          Book Service
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;