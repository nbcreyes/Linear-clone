import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './src/db.js';
import authRoutes from './src/routes/authRoutes.js';
import workspaceRoutes from './src/routes/workspaceRoutes.js';
import issueRoutes from './src/routes/issueRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import activityRoutes from './src/routes/activityRoutes.js';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/workspaces/:workspaceId/issues', issueRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/workspaces/:workspaceId/issues/:issueId/comments', commentRoutes);
app.use('/api/workspaces/:workspaceId/issues/:issueId/activity', activityRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Linear Clone API is running' });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});