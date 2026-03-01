import express from 'express';
import {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
} from '../controllers/issueController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// All routes are protected
router.use(protect);

// GET /api/workspaces/:workspaceId/issues
router.get('/', getIssues);

// GET /api/workspaces/:workspaceId/issues/:id
router.get('/:id', getIssue);

// POST /api/workspaces/:workspaceId/issues
router.post('/', createIssue);

// PUT /api/workspaces/:workspaceId/issues/:id
router.put('/:id', updateIssue);

// DELETE /api/workspaces/:workspaceId/issues/:id
router.delete('/:id', deleteIssue);

export default router;