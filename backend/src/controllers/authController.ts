import { Request, Response } from 'express';
import admin from '../config/firebase';
import User, { IUser } from '../models/User';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseUid, email, name, avatar } = req.body;

    if (!firebaseUid || !email || !name) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
      return;
    }

    // Create new user
    const newUser = new User({
      firebaseUid,
      email,
      name,
      avatar,
      role: 'user',
      points: 50 // Welcome bonus
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        firebaseUid: newUser.firebaseUid,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        points: newUser.points,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        role: user.role,
        points: user.points,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseUid } = req.params;
    const { name, avatar } = req.body;

    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update fields
    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        name: user.name,
        role: user.role,
        points: user.points,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserPoints = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firebaseUid } = req.params;
    const { points, operation = 'add' } = req.body; // operation: 'add' | 'subtract'

    const user = await User.findOne({ firebaseUid });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (operation === 'add') {
      user.points += points;
    } else if (operation === 'subtract') {
      if (user.points < points) {
        res.status(400).json({ message: 'Insufficient points' });
        return;
      }
      user.points -= points;
    }

    await user.save();

    res.json({
      message: 'Points updated successfully',
      user: {
        id: user._id,
        points: user.points
      }
    });
  } catch (error) {
    console.error('Update points error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 