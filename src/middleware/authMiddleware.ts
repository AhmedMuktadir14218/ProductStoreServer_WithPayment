import jwt  from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import config from '../config';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from header

  if (!token) {
    return res.status(401).json({ message: 'Access Denied', success: false });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret as string) as any;
    (req as any).user = decoded; // Attach decoded user info to request
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Token', success: false });
  }
};

export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient Permissions', success: false });
    }
    next();
  };
};
