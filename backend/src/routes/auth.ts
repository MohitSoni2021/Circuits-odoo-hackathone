import { Router } from 'express';
import { registerUser, getUserProfile, updateUserProfile, updateUserPoints } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes - require authentication
router.post('/register', authenticateToken, registerUser);
router.get('/profile/:firebaseUid', authenticateToken, getUserProfile);
router.put('/profile/:firebaseUid', authenticateToken, updateUserProfile);
router.put('/points/:firebaseUid', authenticateToken, updateUserPoints);

export default router;