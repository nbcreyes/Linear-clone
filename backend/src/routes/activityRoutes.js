import express from 'express';
import { getActivity } from '../controllers/activityController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

// GET /api/workspaces/:workspaceId/issues/:issueId/activity
router.get('/', getActivity);

export default router;