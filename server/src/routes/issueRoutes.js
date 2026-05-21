import { Router } from 'express';
import {
  commentIssue,
  createIssue,
  deleteIssue,
  getAnalytics,
  getIssues,
  getMyIssues,
  updateIssueStatus,
  assignIssue,
  upvoteIssue,
} from '../controllers/issueController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();

router.get('/', getIssues);
router.get('/mine', protect, getMyIssues);
router.get('/analytics/overview', protect, adminOnly, getAnalytics);
router.post('/', protect, createIssue);
router.patch('/:id/status', protect, adminOnly, updateIssueStatus);
router.patch('/:id/assign', protect, adminOnly, assignIssue);
router.post('/:id/upvote', protect, upvoteIssue);
router.post('/:id/comments', protect, commentIssue);
router.delete('/:id', protect, adminOnly, deleteIssue);

export default router;
