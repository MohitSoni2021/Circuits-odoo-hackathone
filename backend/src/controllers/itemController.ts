import { Request, Response } from 'express';
import ClothingItem, { IClothingItem } from '../models/ClothingItem';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import { uploadImage } from '../config/cloudinary';

export const createItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Parse item data from FormData
    let itemData: any = {};
    if (req.body.data) {
      try {
        itemData = JSON.parse(req.body.data);
      } catch (error) {
        res.status(400).json({ message: 'Invalid item data format' });
        return;
      }
    } else {
      // Fallback to direct body parsing for backward compatibility
      itemData = req.body;
    }

    const {
      title,
      description,
      category,
      type,
      size,
      condition,
      tags,
      pointsRequired
    } = itemData;

    // Handle image uploads if files are present
    let imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      try {
        const uploadPromises = (req.files as Express.Multer.File[]).map(file => uploadImage(file));
        imageUrls = await Promise.all(uploadPromises);
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        res.status(400).json({ message: 'Failed to upload images' });
        return;
      }
    }

    // Use uploaded images or provided image URLs
    const finalImages = imageUrls.length > 0 ? imageUrls : (itemData.images || []);

    const newItem = new ClothingItem({
      title,
      description,
      category,
      type,
      size,
      condition,
      tags: Array.isArray(tags) ? tags : [],
      images: finalImages,
      uploaderId: req.user._id,
      uploaderName: req.user.name,
      pointsRequired,
      status: 'pending',
      approved: false
    });

    await newItem.save();

    res.status(201).json({
      message: 'Item created successfully',
      item: newItem
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// New endpoint for uploading images only
export const uploadImages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ message: 'No images provided' });
      return;
    }

    const uploadPromises = (req.files as Express.Multer.File[]).map(file => uploadImage(file));
    const imageUrls = await Promise.all(uploadPromises);

    res.json({
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ message: 'Failed to upload images' });
  }
};

export const getAllItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status = 'available', category, approved = true } = req.query;
    
    const filter: any = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (approved !== undefined) filter.approved = approved;

    const items = await ClothingItem.find(filter)
      .populate('uploaderId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const item = await ClothingItem.findById(id)
      .populate('uploaderId', 'name email');

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    res.json({ item });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const item = await ClothingItem.findById(id);

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    // Check if user owns the item or is admin
    if (item.uploaderId.toString() !== req.user._id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    // Remove fields that shouldn't be updated directly
    delete updates.uploaderId;
    delete updates.uploaderName;
    delete updates.approved;

    Object.assign(item, updates);
    await item.save();

    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const item = await ClothingItem.findById(id);

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    // Check if user owns the item or is admin
    if (item.uploaderId.toString() !== req.user._id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    await ClothingItem.findByIdAndDelete(id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const approveItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { approved } = req.body;

    if (!req.user || req.user.role !== 'admin') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    const item = await ClothingItem.findById(id);

    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }

    item.approved = approved;
    item.status = approved ? 'available' : 'pending';
    await item.save();

    res.json({
      message: `Item ${approved ? 'approved' : 'rejected'} successfully`,
      item
    });
  } catch (error) {
    console.error('Approve item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const items = await ClothingItem.find({ uploaderId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};