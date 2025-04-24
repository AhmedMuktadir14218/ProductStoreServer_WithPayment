// src\modules\order\order.interface.ts
import { Document, Types } from 'mongoose';

export interface IOrder extends Document {
  user: Types.ObjectId;
  cars: {
    car: Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  status: "Pending" | "Paid" | "Shipped" | "Completed" | "Cancelled";
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  _id: Types.ObjectId;
}