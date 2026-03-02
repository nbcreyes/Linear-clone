import express from 'express';
import {
  getComments,
  createComment,
  deleteComment,
} from '../controllers/commentController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

// GET /api/workspaces/:workspaceId/issues/:issueId/comments
router.get('/', getComments);

// POST /api/workspaces/:workspaceId/issues/:issueId/comments
router.post('/', createComment);

// DELETE /api/workspaces/:workspaceId/issues/:issueId/comments/:id
router.delete('/:id', deleteComment);

export default router;