import Order from './order.model';
import Car from '../car/car.model';
import mongoose, { Types } from 'mongoose';
import { orderUtils } from './order.utils';
import User from '../user/user.model';
import { IOrder } from './order.interface';
// import {makePaymentAsync} from './order.utils';


export const createOrder = async (req: Request, userId: mongoose.Types.ObjectId, cars: { car: string, quantity: number }[]) => {
  let totalPrice = 0;

  for (const { car: carId, quantity } of cars) {
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new Error('Invalid car ID');
    }

    const car = await Car.findById(carId);
    if (!car) throw new Error('Car not found');

    if (car.quantity < quantity) throw new Error('Insufficient stock');

    totalPrice += car.price * quantity;

    car.quantity -= quantity;
    car.inStock = car.quantity > 0;
    await car.save();
  }

  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const order = await Order.create({ user: userId, cars, totalPrice });

  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id.toString(),
    currency: "BDT",
    customer_email: user.email,
    customer_phone: "01236456789", // Replace with actual user phone if available
    customer_city: 'Dhaka', // Replace with actual user city if available
    customer_name: user.name || 'Default Name',
    customer_address: user.address || 'Default Address',
    client_ip: (req as any).ip,
  };

  try {
    const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

    if (payment?.transactionStatus) {
      await order.updateOne({
        transaction: {
          id: payment.sp_order_id,
          transactionStatus: payment.transactionStatus,
        },
      });
    }

    return {
      checkoutUrl: payment.checkout_url,
      amount: payment.amount,
      currency: payment.currency,
      spOrderId: payment.sp_order_id,
      customerOrderId: payment.customer_order_id,
      clientIp: shurjopayPayload.client_ip,
      intent: payment.intent,
      transactionStatus: payment.transactionStatus,
    };
  } catch (error) {
    console.error('Payment processing error:', error.response?.data || error.message);
    throw new Error('Payment processing failed');
  }
};
export const verifyOrderPayment = async (orderId: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(orderId);

  if (verifiedPayment.length) {
    await Order.findOneAndUpdate(
      {
        "transaction.id": orderId,
      },
      {
        "transaction.bank_status": verifiedPayment[0].bank_status,
        "transaction.sp_code": verifiedPayment[0].sp_code,
        "transaction.sp_message": verifiedPayment[0].sp_message,
        "transaction.transactionStatus": verifiedPayment[0].transaction_status,
        "transaction.method": verifiedPayment[0].method,
        "transaction.date_time": verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status === "Success"
            ? "Paid"
            : verifiedPayment[0].bank_status === "Failed"
            ? "Pending"
            : verifiedPayment[0].bank_status === "Cancel"
            ? "Cancelled"
            : "Pending",
      }
    );
  }

  return verifiedPayment;
};
// export const verifyOrderPayment = async (orderId: string) => {
//   try {
//     const verificationResponse = await orderUtils.verifyPaymentAsync(orderId);
//     return verificationResponse;
//   } catch (error) {
//     console.error('Payment verification error:', error.response?.data || error.message);
//     throw new Error('Payment verification failed');
//   }
// };

// export const getOrders = async () => {
//   return await Order.find().populate('car');
// };
// order.service.ts

export const getOrders = async (page: number = 1, limit: number = 10) => {
  const orders = await Order.find()
    .populate('cars.car') // Correctly populate the nested car reference
    .populate('user', 'email role') // Populate user information
    .skip((page - 1) * limit)
    .limit(limit);

  const totalOrders = await Order.countDocuments();

  return {
    orders,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page,
    totalOrders,
  };
};

// order.service.ts
export const getUserOrders = async (userId: string, page: number = 1, limit: number = 10) => {
  const orders = await Order.find({ user: userId })
    .populate('cars.car')
    .populate('user', 'email role')
    .skip((page - 1) * limit)
    .limit(limit);

  const totalOrders = await Order.countDocuments({ user: userId });
  console.log(`Service: Found ${orders.length} orders for user ID: ${userId}`);

  return {
    orders,
    totalPages: Math.ceil(totalOrders / limit),
    currentPage: page,
    totalOrders,
  };
};


// Update order status
export const updateOrderStatusService = async (orderId: string, status: string) => {
  const validStatuses = ["Pending", "Paid", "Shipped", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  return updatedOrder;
};


export const calculateRevenue = async () => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);

  return orders.length > 0 ? orders[0].totalRevenue : 0;
};
