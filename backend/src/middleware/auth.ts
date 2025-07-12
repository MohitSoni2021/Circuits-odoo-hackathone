import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    firebaseUid: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    points: number;
    avatar?: string;
    _id: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('Auth middleware - Token received:', !!token);

    if (!token) {
      console.log('Auth middleware - No token provided');
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    // Verify Firebase token
    console.log('Auth middleware - Verifying Firebase token...');
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    console.log('Auth middleware - Token verified, Firebase UID:', firebaseUid);

    // Find user in database
    console.log('Auth middleware - Looking for user in database...');
    const user = await User.findOne({ firebaseUid }) as IUser | null;
    
    if (!user) {
      console.log('Auth middleware - User not found in database for UID:', firebaseUid);
      res.status(404).json({ message: 'User not found' });
      return;
    }

    console.log('Auth middleware - User found in database:', user.email);

    // Attach user to request
    req.user = {
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      role: user.role,
      points: user.points,
      avatar: user.avatar,
      _id: (user._id as any).toString()
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (roles: ('user' | 'admin')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['admin']);
export const requireUser = requireRole(['user', 'admin']);