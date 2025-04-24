// src\modules\order\order.model.ts
import mongoose, { Schema } from 'mongoose';
import { IOrder } from './order.interface';

const OrderSchema: Schema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cars: [
    {
      car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
      quantity: { type: Number, required: true, min: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Shipped", "Completed", "Cancelled"],
    default: "Pending",
  },
  transaction: {
    id: String,
    transactionStatus: String,
    bank_status: String,
    sp_code: String,
    sp_message: String,
    method: String,
    date_time: String,
  },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);