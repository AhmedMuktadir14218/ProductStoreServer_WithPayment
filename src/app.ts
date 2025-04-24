import express from 'express';
import cors from 'cors';
import carRoutes from './modules/car/car.route';
import orderRoutes from './modules/order/order.route';
import userRoutes from './modules/user/user.route';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes); // User Authentication Routes
app.use('/api/cars', carRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Car Store APP');
});

// Global Error Handler
app.use(errorHandler);

export default app;
