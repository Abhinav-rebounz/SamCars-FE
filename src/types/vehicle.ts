export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  vin?: string;
  exterior_color?: string;
  interior_color?: string;
  transmission?: string;
  body_type?: string;
  fuel_type?: string;
  engine?: string;
  condition?: string;
  features?: string[];
  tags?: string[];
  images: string[];
  status: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
} 