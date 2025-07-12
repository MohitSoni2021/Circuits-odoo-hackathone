import { Router } from 'express';
import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  approveItem,
  getUserItems,
  uploadImages
} from '../controllers/itemController';
import { authenticateToken, requireUser, requireAdmin } from '../middleware/auth';
import { uploadMultiple, handleUploadError } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllItems);

// Protected routes - specific routes first
router.post('/upload-images', authenticateToken, requireUser, uploadMultiple, handleUploadError, uploadImages);
router.get('/user/items', authenticateToken, requireUser, getUserItems);
router.post('/', authenticateToken, requireUser, uploadMultiple, handleUploadError, createItem);

// Dynamic routes last
router.get('/:id', getItemById);
router.put('/:id', authenticateToken, requireUser, updateItem);
router.delete('/:id', authenticateToken, requireUser, deleteItem);

// Admin routes
router.put('/:id/approve', authenticateToken, requireAdmin, approveItem);

export default router; 