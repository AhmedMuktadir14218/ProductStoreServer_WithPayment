import mongoose, { Schema } from 'mongoose';
import { ICar } from './car.interface';

const CarSchema: Schema = new Schema<ICar>({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true, min: 0 }, // Validation: price must be positive
    category: {
      type: String,
      enum: ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'],
      required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    inStock: { type: Boolean, default: true },
    imageUrl: { type: String }
  }, { timestamps: true });

export default mongoose.model<ICar>('Car', CarSchema);