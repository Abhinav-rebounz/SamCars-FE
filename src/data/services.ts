export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: 'maintenance' | 'repair' | 'cosmetic' | 'inspection';
  image: string;
}

export const services: Service[] = [
  {
    id: '1',
    name: 'Oil Change',
    description: 'Complete oil change with filter replacement and fluid top-off. Includes multi-point inspection.',
    price: 49.99,
    duration: '30-45 minutes',
    category: 'maintenance',
    image: 'https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg'
  },
  {
    id: '2',
    name: 'Brake Service',
    description: 'Inspection and replacement of brake pads, rotors, and fluid as needed. Ensures optimal braking performance.',
    price: 199.99,
    duration: '1-2 hours',
    category: 'repair',
    image: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg'
  },
  {
    id: '3',
    name: 'Tire Rotation & Balance',
    description: 'Rotation and balancing of all tires to ensure even wear and smooth ride.',
    price: 79.99,
    duration: '45-60 minutes',
    category: 'maintenance',
    image: 'https://images.pexels.com/photos/4489732/pexels-photo-4489732.jpeg'
  },
  {
    id: '4',
    name: 'Full Detailing',
    description: 'Complete interior and exterior cleaning, including waxing, polishing, and fabric protection.',
    price: 249.99,
    duration: '3-4 hours',
    category: 'cosmetic',
    image: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg'
  },
  {
    id: '5',
    name: 'Pre-Purchase Inspection',
    description: 'Comprehensive inspection of vehicle before purchase. Includes mechanical, electrical, and body assessment.',
    price: 149.99,
    duration: '1-2 hours',
    category: 'inspection',
    image: 'https://images.pexels.com/photos/97075/pexels-photo-97075.jpeg'
  },
  {
    id: '6',
    name: 'AC Service',
    description: 'Inspection and recharge of air conditioning system. Includes leak check and performance test.',
    price: 129.99,
    duration: '1 hour',
    category: 'maintenance',
    image: 'https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg'
  }
];

export const getServiceById = (id: string): Service | undefined => {
  return services.find(service => service.id === id);
};

export const getServicesByCategory = (category: Service['category']): Service[] => {
  return services.filter(service => service.category === category);
};