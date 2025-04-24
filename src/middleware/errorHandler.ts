import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name === 'ValidationError') {
    res.status(400).json({
      message: 'Validation failed',
      success: false,
      error: {
        name: err.name,
        errors: err.errors,
      },
    });
  } else {
    res.status(err.statusCode || 500).json({
      message: err.message || 'Internal Server Error',
      success: false,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }
};
