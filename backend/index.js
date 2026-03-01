import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './src/db.js';
import authRoutes from './src/routes/authRoutes.js';
import issueRoutes from './src/routes/issueRoutes.js';
import protect from './src/middleware/authMiddleware.js';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Linear Clone API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});