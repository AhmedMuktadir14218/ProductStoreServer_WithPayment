import mongoose from 'mongoose';
import app from './app';
import config from './config';

async function server() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.database_url as string);

    // Start the server
    app.listen(config.port || 5000, () => {
      console.log(`Server running on PORT ${config.port || 5000}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
}

console.log('Configuration:', config);

// Start the server
server();
