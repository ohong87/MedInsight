import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors'; 

// Import routes for 3 branches of operations
import testRoutes from '../routes/testRoutes'; 
import userRoutes from '../routes/userRoutes'; 
import userTestRoutes from '../routes/userTestRoutes';

import connectDB from './mongodb/connect'; // Utility for connecting to MongoDB

dotenv.config(); // Load environment variables from .env file

const app = express(); // Create an Express application
// enabling CORS for all requests
app.use(cors()); 

app.use(express.json({ limit: '50mb' })); // Parse JSON requests with a body limit of 50mb

// Hello World endpoint to check application is functional
app.get('/', (req, res) => { 
  res.send({ message: 'Hello World!' });
});

// Use test routes for any requests to '/tests'
app.use('/tests', testRoutes);

// Use user routes for any requests to '/user'
app.use('/user', userRoutes);

// Use userTest routes for any requests to '/userTest'
app.use('/userTest', userTestRoutes);

// Function to start the server and connect to the database
const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL as string); // Connect to MongoDB with the URL from environment variables

    app.listen(process.env.PORT, () => { // Start the server on the port from environment variables
      console.log(`Server is running on port ${process.env.PORT}`); 
    });

  } catch (error) {
    console.log(error); // Log any errors that occur during startup
  }
}

startServer(); // Call the function to start the server
