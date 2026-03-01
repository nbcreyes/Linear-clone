import express from 'express';
import {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  deleteIssue,
} from '../controllers/issueController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes below are protected
router.use(protect);

// GET /api/issues
router.get('/', getIssues);

// GET /api/issues/:id
router.get('/:id', getIssue);

// POST /api/issues
router.post('/', createIssue);

// PUT /api/issues/:id
router.put('/:id', updateIssue);

// DELETE /api/issues/:id
router.delete('/:id', deleteIssue);

export default router;