import { Router } from 'express';
import { handleRegister, handleLogin, handleGetProfile } from './user.controller';
import { authenticateJWT } from '../../middleware/authMiddleware';

const router = Router();

router.post('/register', handleRegister); // Register User
router.post('/login', handleLogin); // Login User
router.get('/profile', authenticateJWT, handleGetProfile); // Get User Profile (Protected)

export default router;



