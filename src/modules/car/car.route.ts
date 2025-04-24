import { Router } from 'express';
import { authenticateJWT, authorizeRole } from '../../middleware/authMiddleware';
import {
  handleCreateCar, handleGetCars, handleGetCarById, handleUpdateCar, handleDeleteCar
} from './car.controller';

const router = Router();

router.post('/', authenticateJWT, authorizeRole(['admin','user']), handleCreateCar);
router.get('/', handleGetCars);
router.get('/:carId', handleGetCarById);
router.put('/:carId', authenticateJWT, authorizeRole(['admin']), handleUpdateCar);
router.delete('/:carId', authenticateJWT, authorizeRole(['admin']), handleDeleteCar);











export default router;
