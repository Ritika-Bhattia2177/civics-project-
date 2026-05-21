import { Router } from 'express';
import { getUsers, blockUser, changeRole, getUserReports } from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, adminOnly, getUsers);
router.patch('/:id/block', protect, adminOnly, blockUser);
router.patch('/:id/role', protect, adminOnly, changeRole);
router.get('/:id/reports', protect, adminOnly, getUserReports);

export default router;
