import { Request, Response } from 'express';
import SwapRequest, { ISwapRequest } from '../models/SwapRequest';
import ClothingItem from '../models/ClothingItem';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const createSwapRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      toUserId,
      itemId,
      offerItemId,
      pointsOffered,
      message
    } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Check if target item exists and is available
    const targetItem = await ClothingItem.findById(itemId);
    if (!targetItem || targetItem.status !== 'available' || !targetItem.approved) {
      res.status(404).json({ message: 'Target item not available' });
      return;
    }

    // Check if user is not trying to swap their own item
    if (targetItem.uploaderId.toString() === req.user._id) {
      res.status(400).json({ message: 'Cannot swap your own item' });
      return;
    }

    // Check if offer item exists (if provided)
    if (offerItemId) {
      const offerItem = await ClothingItem.findById(offerItemId);
      if (!offerItem || offerItem.uploaderId.toString() !== req.user._id) {
        res.status(404).json({ message: 'Offer item not found or not owned by you' });
        return;
      }
    }

    // Check if user has enough points (if offering points)
    if (pointsOffered && pointsOffered > 0) {
      const user = await User.findById(req.user._id);
      if (!user || user.points < pointsOffered) {
        res.status(400).json({ message: 'Insufficient points' });
        return;
      }
    }

    const newSwapRequest = new SwapRequest({
      fromUserId: req.user._id,
      toUserId,
      itemId,
      offerItemId,
      pointsOffered,
      message,
      status: 'pending'
    });

    await newSwapRequest.save();

    res.status(201).json({
      message: 'Swap request created successfully',
      swapRequest: newSwapRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSwapRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const { status } = req.query;

    const filter: any = {
      $or: [
        { fromUserId: req.user._id },
        { toUserId: req.user._id }
      ]
    };

    if (status) {
      filter.status = status;
    }

    const swapRequests = await SwapRequest.find(filter)
      .populate('fromUserId', 'name email')
      .populate('toUserId', 'name email')
      .populate('itemId', 'title images')
      .populate('offerItemId', 'title images')
      .sort({ createdAt: -1 });

    res.json({ swapRequests });
  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSwapRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const swapRequest = await SwapRequest.findById(id)
      .populate('fromUserId', 'name email')
      .populate('toUserId', 'name email')
      .populate('itemId', 'title uploaderId')
      .populate('offerItemId', 'title uploaderId');

    if (!swapRequest) {
      res.status(404).json({ message: 'Swap request not found' });
      return;
    }

    // Check if user is authorized to update this request
    if (swapRequest.toUserId.toString() !== req.user._id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    // Only allow status updates
    if (status && ['pending', 'accepted', 'rejected'].includes(status)) {
      swapRequest.status = status;
      await swapRequest.save();

      // If accepted, handle the swap
      if (status === 'accepted') {
        await handleAcceptedSwap(swapRequest);
      }

      res.json({
        message: 'Swap request updated successfully',
        swapRequest
      });
    } else {
      res.status(400).json({ message: 'Invalid status' });
    }
  } catch (error) {
    console.error('Update swap request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleAcceptedSwap = async (swapRequest: ISwapRequest): Promise<void> => {
  try {
    // Update item statuses
    await ClothingItem.findByIdAndUpdate(swapRequest.itemId, { status: 'swapped' });
    
    if (swapRequest.offerItemId) {
      await ClothingItem.findByIdAndUpdate(swapRequest.offerItemId, { status: 'swapped' });
    }

    // Handle points transfer if applicable
    if (swapRequest.pointsOffered && swapRequest.pointsOffered > 0) {
      const fromUser = await User.findById(swapRequest.fromUserId);
      const toUser = await User.findById(swapRequest.toUserId);

      if (fromUser && toUser) {
        fromUser.points -= swapRequest.pointsOffered;
        toUser.points += swapRequest.pointsOffered;

        await fromUser.save();
        await toUser.save();
      }
    }
  } catch (error) {
    console.error('Handle accepted swap error:', error);
  }
};

export const deleteSwapRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const swapRequest = await SwapRequest.findById(id);

    if (!swapRequest) {
      res.status(404).json({ message: 'Swap request not found' });
      return;
    }

    // Check if user is authorized to delete this request
    if (swapRequest.fromUserId.toString() !== req.user._id && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    await SwapRequest.findByIdAndDelete(id);

    res.json({ message: 'Swap request deleted successfully' });
  } catch (error) {
    console.error('Delete swap request error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 