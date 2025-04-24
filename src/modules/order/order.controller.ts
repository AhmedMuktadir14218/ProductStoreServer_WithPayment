import { Request, Response, NextFunction } from 'express';
import { createOrder, getOrders, calculateRevenue, verifyOrderPayment, getUserOrders, updateOrderStatusService } from './order.service';
import { orderUtils } from './order.utils'; // Ensure this import is correct
import User from '../user/user.model';

// Place an order and initiate payment

export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cars } = req.body; // Expecting an array of { car, quantity }
    const userId = (req as any).user.userId;

    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const paymentDetails = await createOrder(req, userId, cars);

    res.status(201).json({
      message: 'Order placed successfully',
      success: true,
      payment: paymentDetails,
      orderDetails: {
        cars,
        userId,
      }
    });
  } catch (error) {
    console.error('Error placing order:', error);
    next(error);
  }
};
// Fetch all orders with pagination
export const fetchOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getOrders(page, limit);

    res.status(200).json({
      message: 'Orders retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const fetchUserOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getUserOrders(userId, page, limit);
    console.log(`Controller: Retrieved ${result.orders.length} orders for user ID: ${userId}`);

    res.status(200).json({
      message: 'User orders retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// Verify payment status
export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    const verificationDetails = await verifyOrderPayment(orderId as string);

    res.status(200).json({
      message: 'Payment verified successfully',
      success: true,
      verificationDetails,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    next(error);
  }
};

export const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const updatedOrder = await updateOrderStatusService(orderId, status);

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order status updated successfully',
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    next(error);
  }
};
// Calculate total revenue
export const getRevenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalRevenue = await calculateRevenue();
    res.status(200).json({
      message: 'Revenue calculated successfully',
      success: true,
      data: { totalRevenue },
    });
  } catch (error) {
    next(error);
  }
};