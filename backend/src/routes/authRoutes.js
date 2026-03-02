import express from 'express';
import { register, login, updateProfile } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// PUT /api/auth/profile
router.put('/profile', protect, updateProfile);

export default router;