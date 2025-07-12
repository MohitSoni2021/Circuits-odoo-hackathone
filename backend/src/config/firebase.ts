import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// For now, we'll use a mock admin that accepts any token
// This allows the backend to start without service account credentials
const mockAdmin = {
  auth: () => ({
    verifyIdToken: async (token: string) => {
      // For development, accept any token and return a mock user
      console.log('Mock Firebase Admin: Verifying token');
      return { 
        uid: 'mock-user-id',
        email: 'user@example.com',
        email_verified: true
      };
    }
  })
};

export default mockAdmin as any; 