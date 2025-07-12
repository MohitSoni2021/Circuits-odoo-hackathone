# ReWear - Clothing Swap Platform

A modern clothing swap platform built with React, TypeScript, Firebase Authentication, and MongoDB backend with role-based access control.

## Features

- 🔐 **Firebase Authentication** - Secure user authentication with email/password
- 🎭 **Role-Based Access Control** - User and Admin roles with different permissions
- 🛍️ **Clothing Item Management** - Upload, browse, and manage clothing items
- 🔄 **Swap System** - Request and manage clothing swaps between users
- 💰 **Points System** - Earn and spend points for clothing items
- 📱 **Responsive Design** - Modern UI built with Tailwind CSS
- 🗄️ **MongoDB Backend** - Robust data storage with Mongoose ODM

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Firebase SDK for authentication

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Firebase Admin SDK for token verification
- JWT for session management
- Role-based middleware

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Firebase project

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a service account:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

### 2. Environment Configuration

#### Frontend (.env)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000
```

Update `src/config/firebase.ts` with your Firebase config:
```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

#### Backend (.env)
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rewear
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789012345678901
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com
```

### 3. Installation

#### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

#### Backend
```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Database Setup

1. Start MongoDB (local or cloud)
2. The application will automatically create the necessary collections

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile/:firebaseUid` - Get user profile
- `PUT /api/auth/profile/:firebaseUid` - Update user profile
- `PUT /api/auth/points/:firebaseUid` - Update user points

### Items
- `GET /api/items` - Get all items (public)
- `GET /api/items/:id` - Get item by ID (public)
- `POST /api/items` - Create new item (authenticated)
- `PUT /api/items/:id` - Update item (owner or admin)
- `DELETE /api/items/:id` - Delete item (owner or admin)
- `PUT /api/items/:id/approve` - Approve item (admin only)

### Swaps
- `GET /api/swaps` - Get user's swap requests (authenticated)
- `POST /api/swaps` - Create swap request (authenticated)
- `PUT /api/swaps/:id` - Update swap request (authenticated)
- `DELETE /api/swaps/:id` - Delete swap request (authenticated)

## Role-Based Access Control

### User Role
- Create and manage their own clothing items
- Browse available items
- Create swap requests
- Manage their profile and points

### Admin Role
- All user permissions
- Approve/reject clothing items
- Manage all users and items
- View system analytics

## Database Schema

### User
```typescript
{
  firebaseUid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  points: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### ClothingItem
```typescript
{
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  uploaderId: ObjectId;
  uploaderName: string;
  pointsRequired: number;
  status: 'available' | 'pending' | 'swapped';
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### SwapRequest
```typescript
{
  fromUserId: ObjectId;
  toUserId: ObjectId;
  itemId: ObjectId;
  offerItemId?: ObjectId;
  pointsOffered?: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev          # Start development server with nodemon
npm run build        # Build TypeScript
npm start            # Start production server
```

## Security Features

- Firebase token verification on every authenticated request
- Role-based middleware for endpoint protection
- Input validation and sanitization
- CORS configuration for frontend-backend communication
- Environment variable protection for sensitive data

## Deployment

### Frontend
- Build the project: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting service

### Backend
- Build the project: `npm run build`
- Deploy to Heroku, Railway, or any Node.js hosting service
- Set up MongoDB Atlas for production database
- Configure environment variables in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 