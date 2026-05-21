import { Router } from 'express';
import { forgotPassword, getMe, loginUser, registerUser, resetPassword, updateProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);
router.patch('/change-password', protect, changePassword);

export default router;
