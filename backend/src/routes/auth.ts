import { Router } from 'express';
import { registerUser, getUserProfile, updateUserProfile, updateUserPoints } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', registerUser);

// Protected routes
router.get('/profile/:firebaseUid', authenticateToken, getUserProfile);
router.put('/profile/:firebaseUid', authenticateToken, updateUserProfile);
router.put('/points/:firebaseUid', authenticateToken, updateUserPoints);

export default router;