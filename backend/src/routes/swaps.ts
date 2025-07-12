import { Router } from 'express';
import {
  createSwapRequest,
  getSwapRequests,
  updateSwapRequest,
  deleteSwapRequest
} from '../controllers/swapController';
import { authenticateToken, requireUser } from '../middleware/auth';

const router = Router();

// Protected routes
router.post('/', authenticateToken, requireUser, createSwapRequest);
router.get('/', authenticateToken, requireUser, getSwapRequests);
router.put('/:id', authenticateToken, requireUser, updateSwapRequest);
router.delete('/:id', authenticateToken, requireUser, deleteSwapRequest);

export default router; 