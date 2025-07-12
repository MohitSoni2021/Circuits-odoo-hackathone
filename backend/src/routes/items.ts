import { Router } from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  approveItem,
  getUserItems
} from '../controllers/itemController';
import { authenticateToken, requireUser, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllItems);
router.get('/:id', getItemById);

// Protected routes
router.post('/', authenticateToken, requireUser, createItem);
router.put('/:id', authenticateToken, requireUser, updateItem);
router.delete('/:id', authenticateToken, requireUser, deleteItem);
router.get('/user/items', authenticateToken, requireUser, getUserItems);

// Admin routes
router.put('/:id/approve', authenticateToken, requireAdmin, approveItem);

export default router; 