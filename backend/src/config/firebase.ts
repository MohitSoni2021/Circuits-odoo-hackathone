import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseAdmin: admin.app.App;

try {
  // Check if we have the required Firebase credentials
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey && privateKey !== 'your-actual-private-key') {
    // Initialize with real credentials
    firebaseAdmin = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n')
      })
    });
    console.log('Firebase Admin initialized with real credentials');
  } else {
    // Fallback to mock admin for development
    console.log('Firebase Admin: Using mock credentials for development');
    const mockAdmin = {
      auth: () => ({
        verifyIdToken: async (token: string) => {
          console.log('Mock Firebase Admin: Verifying token');
          
          // For development, try to extract UID from token if it's a JWT
          try {
            // Simple JWT decode (base64 decode the payload part)
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
              console.log('Mock Firebase Admin: Extracted UID from token:', payload.sub);
              return { 
                uid: payload.sub || 'mock-user-id',
                email: payload.email || 'user@example.com',
                email_verified: payload.email_verified || true
              };
            }
          } catch (error) {
            console.log('Mock Firebase Admin: Could not decode token, using default');
          }
          
          // Fallback to default mock user
          return { 
            uid: 'mock-user-id',
            email: 'user@example.com',
            email_verified: true
          };
        }
      })
    };
    firebaseAdmin = mockAdmin as any;
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  console.log('Firebase Admin: Falling back to mock credentials');
  
  const mockAdmin = {
    auth: () => ({
      verifyIdToken: async (token: string) => {
        console.log('Mock Firebase Admin: Verifying token');
        
        // For development, try to extract UID from token if it's a JWT
        try {
          // Simple JWT decode (base64 decode the payload part)
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            console.log('Mock Firebase Admin: Extracted UID from token:', payload.sub);
            return { 
              uid: payload.sub || 'mock-user-id',
              email: payload.email || 'user@example.com',
              email_verified: payload.email_verified || true
            };
          }
        } catch (error) {
          console.log('Mock Firebase Admin: Could not decode token, using default');
        }
        
        // Fallback to default mock user
        return { 
          uid: 'mock-user-id',
          email: 'user@example.com',
          email_verified: true
        };
      }
    })
  };
  firebaseAdmin = mockAdmin as any;
}

export default firebaseAdmin; 