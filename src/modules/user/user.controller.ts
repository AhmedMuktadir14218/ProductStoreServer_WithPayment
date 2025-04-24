import { Request, Response, NextFunction } from 'express'
import { getUserProfile, loginUser, registerUser } from './user.service';
export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const user = await registerUser(email, password, role);
    res.status(201).json({
      message: 'User registered successfully',
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const data = await loginUser(email, password);
    res.status(200).json({
      message: 'Login successful',
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId; // Extract from JWT middleware
    const user = await getUserProfile(userId);
    res.status(200).json({
      message: 'User profile fetched successfully',
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
