import express from 'express';
import {
  createWorkspace,
  joinWorkspace,
  getWorkspace,
  getUserWorkspaces,
} from '../controllers/workspaceController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// GET /api/workspaces
router.get('/', getUserWorkspaces);

// POST /api/workspaces
router.post('/', createWorkspace);

// POST /api/workspaces/join
router.post('/join', joinWorkspace);

// GET /api/workspaces/:id
router.get('/:id', getWorkspace);

export default router;