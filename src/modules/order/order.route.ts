import { Router } from 'express';
import { placeOrder, fetchOrders, getRevenue, verifyPayment, fetchUserOrders, updateOrderStatus } from './order.controller';
import { authenticateJWT, authorizeRole } from '../../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateJWT, authorizeRole(['user','admin']), placeOrder);
router.get('/', authenticateJWT, authorizeRole(['user','admin']), fetchOrders);
router.get('/verify', authenticateJWT, authorizeRole(['user','admin']), verifyPayment);

router.get('/revenue', authenticateJWT, authorizeRole(['admin']), getRevenue);

router.get('/users/:userId', authenticateJWT, authorizeRole(['user','admin']), fetchUserOrders);
router.patch('/status/:orderId', authenticateJWT, authorizeRole(['admin']), updateOrderStatus);

export default router;
