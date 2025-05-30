export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  exteriorColor: string;
  interiorColor: string;
  vin: string;
  fuelType: string;
  transmission: string;
  engine: string;
  drivetrain: string;
  bodyType: string;
  condition: string;
  features: string[];
  description: string;
  images: string[];
  tags: ('new' | 'featured' | 'price-drop')[];
  dateAdded: string;
  isSold: boolean;
}

// Mock data for vehicles
export const vehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    price: 22500,
    mileage: 35000,
    exteriorColor: 'Silver',
    interiorColor: 'Black',
    vin: '4T1BF1FK5LU123456',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '2.5L 4-Cylinder',
    drivetrain: 'FWD',
    bodyType: 'Sedan',
    condition: 'Excellent',
    features: [
      'Bluetooth',
      'Backup Camera',
      'Apple CarPlay',
      'Android Auto',
      'Lane Departure Warning',
      'Adaptive Cruise Control'
    ],
    description: 'This 2020 Toyota Camry is in excellent condition with low mileage. It comes with a clean CARFAX report and has been well-maintained. The vehicle includes Toyota Safety Sense features and a premium audio system.',
    images: [
      'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
      'https://images.pexels.com/photos/193021/pexels-photo-193021.jpeg',
      'https://images.pexels.com/photos/2920064/pexels-photo-2920064.jpeg'
    ],
    tags: ['featured'],
    dateAdded: '2023-09-15',
    isSold: false
  },
  {
    id: '2',
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    price: 28900,
    mileage: 22000,
    exteriorColor: 'Blue',
    interiorColor: 'Gray',
    vin: '7FARW2H52ME123456',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '1.5L Turbo 4-Cylinder',
    drivetrain: 'AWD',
    bodyType: 'SUV',
    condition: 'Excellent',
    features: [
      'Leather Seats',
      'Sunroof',
      'Navigation System',
      'Heated Seats',
      'Blind Spot Monitoring',
      'Power Liftgate'
    ],
    description: 'This 2021 Honda CR-V is a versatile and reliable SUV with all-wheel drive. Perfect for families or anyone needing extra space and capability. Features include leather seats, a panoramic sunroof, and Honda Sensing safety suite.',
    images: [
      'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
      'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg'
    ],
    tags: ['new', 'featured'],
    dateAdded: '2023-10-05',
    isSold: false
  },
  {
    id: '3',
    make: 'Ford',
    model: 'F-150',
    year: 2019,
    price: 32000,
    mileage: 45000,
    exteriorColor: 'Red',
    interiorColor: 'Black',
    vin: '1FTEW1EP3KFA12345',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '3.5L V6 EcoBoost',
    drivetrain: '4WD',
    bodyType: 'Truck',
    condition: 'Good',
    features: [
      'Towing Package',
      'Bed Liner',
      'Touchscreen Infotainment',
      'Backup Camera',
      'Bluetooth',
      'Power Windows'
    ],
    description: 'This 2019 Ford F-150 is a capable and powerful truck with four-wheel drive. It has been well-maintained and comes with a towing package and bed liner. Perfect for work or play.',
    images: [
      'https://images.pexels.com/photos/2533092/pexels-photo-2533092.jpeg',
      'https://images.pexels.com/photos/2676096/pexels-photo-2676096.jpeg',
      'https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg'
    ],
    tags: ['price-drop'],
    dateAdded: '2023-08-20',
    isSold: false
  },
  {
    id: '4',
    make: 'BMW',
    model: '3 Series',
    year: 2022,
    price: 42500,
    mileage: 12000,
    exteriorColor: 'Black',
    interiorColor: 'Tan',
    vin: 'WBA5R7C54LFH12345',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '2.0L 4-Cylinder Turbo',
    drivetrain: 'RWD',
    bodyType: 'Sedan',
    condition: 'Excellent',
    features: [
      'Premium Sound System',
      'Leather Seats',
      'Navigation',
      'Sunroof',
      'Heated Seats',
      'Parking Sensors'
    ],
    description: 'This 2022 BMW 3 Series is a luxury sedan with low mileage and in pristine condition. It comes loaded with premium features including leather interior, navigation, and a premium sound system.',
    images: [
      'https://images.pexels.com/photos/892522/pexels-photo-892522.jpeg',
      'https://images.pexels.com/photos/248687/pexels-photo-248687.jpeg',
      'https://images.pexels.com/photos/1104768/pexels-photo-1104768.jpeg'
    ],
    tags: ['new', 'featured'],
    dateAdded: '2023-11-10',
    isSold: false
  },
  {
    id: '5',
    make: 'Chevrolet',
    model: 'Equinox',
    year: 2020,
    price: 24000,
    mileage: 28000,
    exteriorColor: 'White',
    interiorColor: 'Gray',
    vin: '2GNAXSEV5L612345',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '1.5L Turbo 4-Cylinder',
    drivetrain: 'FWD',
    bodyType: 'SUV',
    condition: 'Very Good',
    features: [
      'Apple CarPlay',
      'Android Auto',
      'Backup Camera',
      'Bluetooth',
      'Keyless Entry',
      'Remote Start'
    ],
    description: 'This 2020 Chevrolet Equinox is a practical and efficient SUV with plenty of modern features. It offers excellent fuel economy and a comfortable ride, making it perfect for daily commuting or family trips.',
    images: [
      'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
      'https://images.pexels.com/photos/3786091/pexels-photo-3786091.jpeg',
      'https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg'
    ],
    tags: [],
    dateAdded: '2023-09-28',
    isSold: false
  },
  {
    id: '6',
    make: 'Tesla',
    model: 'Model 3',
    year: 2021,
    price: 48900,
    mileage: 15000,
    exteriorColor: 'Blue',
    interiorColor: 'White',
    vin: '5YJ3E1EA8MF123456',
    fuelType: 'Electric',
    transmission: 'Automatic',
    engine: 'Electric',
    drivetrain: 'RWD',
    bodyType: 'Sedan',
    condition: 'Excellent',
    features: [
      'Autopilot',
      'Premium Sound',
      'Glass Roof',
      'Heated Seats',
      'Navigation',
      'Supercharging Capability'
    ],
    description: 'This 2021 Tesla Model 3 is an all-electric vehicle with impressive range and performance. It features Tesla\'s Autopilot system and a sleek, minimalist interior with a large touchscreen display.',
    images: [
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg',
      'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg'
    ],
    tags: ['featured'],
    dateAdded: '2023-10-15',
    isSold: false
  }
];

// Filter functions
export const filterVehicles = (
  vehicleList: Vehicle[],
  filters: {
    make?: string;
    model?: string;
    minYear?: number;
    maxYear?: number;
    minPrice?: number;
    maxPrice?: number;
    minMileage?: number;
    maxMileage?: number;
    bodyType?: string;
    transmission?: string;
    tags?: string[];
  }
) => {
  return vehicleList.filter(vehicle => {
    // Check make
    if (filters.make && vehicle.make !== filters.make) return false;
    
    // Check model
    if (filters.model && vehicle.model !== filters.model) return false;
    
    // Check year range
    if (filters.minYear && vehicle.year < filters.minYear) return false;
    if (filters.maxYear && vehicle.year > filters.maxYear) return false;
    
    // Check price range
    if (filters.minPrice && vehicle.price < filters.minPrice) return false;
    if (filters.maxPrice && vehicle.price > filters.maxPrice) return false;
    
    // Check mileage range
    if (filters.minMileage && vehicle.mileage < filters.minMileage) return false;
    if (filters.maxMileage && vehicle.mileage > filters.maxMileage) return false;
    
    // Check body type
    if (filters.bodyType && vehicle.bodyType !== filters.bodyType) return false;
    
    // Check transmission
    if (filters.transmission && vehicle.transmission !== filters.transmission) return false;
    
    // Check tags
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => 
        vehicle.tags.includes(tag as 'new' | 'featured' | 'price-drop')
      );
      if (!hasTag) return false;
    }
    
    return true;
  });
};

// Sort functions
export const sortVehicles = (
  vehicleList: Vehicle[],
  sortBy: 'price-asc' | 'price-desc' | 'year-asc' | 'year-desc' | 'mileage-asc' | 'mileage-desc' | 'newest'
) => {
  const sortedList = [...vehicleList];
  
  switch (sortBy) {
    case 'price-asc':
      return sortedList.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedList.sort((a, b) => b.price - a.price);
    case 'year-asc':
      return sortedList.sort((a, b) => a.year - b.year);
    case 'year-desc':
      return sortedList.sort((a, b) => b.year - a.year);
    case 'mileage-asc':
      return sortedList.sort((a, b) => a.mileage - b.mileage);
    case 'mileage-desc':
      return sortedList.sort((a, b) => b.mileage - a.mileage);
    case 'newest':
      return sortedList.sort((a, b) => 
        new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    default:
      return sortedList;
  }
};

// Get unique values for filters
export const getUniqueValues = (field: keyof Vehicle) => {
  const values = vehicles.map(vehicle => vehicle[field]);
  return [...new Set(values)];
};

// Get vehicle by ID
export const getVehicleById = (id: string): Vehicle | undefined => {
  return vehicles.find(vehicle => vehicle.id === id);
};