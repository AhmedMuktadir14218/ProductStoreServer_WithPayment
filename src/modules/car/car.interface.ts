import { Document } from 'mongoose';

export interface ICar {
  brand: string;
  model: string;
  year: number;
  price: number;
  category: 'Sedan' | 'SUV' | 'Truck' | 'Coupe' | 'Convertible';
  description: string;
  quantity: number;
  inStock: boolean;
  imageUrl: string;
}
