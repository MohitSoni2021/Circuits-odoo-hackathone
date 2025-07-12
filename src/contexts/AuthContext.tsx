import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { getApiUrl, getApiHeaders, API_CONFIG } from '../config/api';

interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  role: 'user' | 'admin';
  avatar?: string;
  firebaseUid: string;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  registerUser: (userData: Partial<User>, firebaseUserParam?: FirebaseUser) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        console.log('Auth state changed - Firebase user detected:', firebaseUser.uid);
        // Get user data from backend
        try {
          const token = await firebaseUser.getIdToken();
          console.log('Fetching user profile for UID:', firebaseUser.uid);
          
          const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/profile/${firebaseUser.uid}`), {
            headers: getApiHeaders(token)
          });
          
          console.log('Profile fetch response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('User profile fetched successfully:', data.user);
            setUser(data.user);
          } else {
            const errorData = await response.json();
            console.error('Profile fetch failed:', errorData);
            // User exists in Firebase but not in our database
            console.log('User not found in database');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        console.log('Auth state changed - No Firebase user');
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const registerUser = async (userData: Partial<User>, firebaseUserParam?: FirebaseUser): Promise<boolean> => {
    try {
      const userToUse = firebaseUserParam || firebaseUser;
      
      if (!userToUse) {
        console.error('No Firebase user available for registration');
        return false;
      }

      const token = await userToUse.getIdToken();
      console.log('Attempting to register user with Firebase UID:', userToUse.uid);
      console.log('Current firebaseUser state UID:', firebaseUser?.uid);
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH + '/register'), {
        method: 'POST',
        headers: getApiHeaders(token),
        body: JSON.stringify({
          name: userData.name,
          avatar: userData.avatar
        })
      });

      console.log('Registration response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('User registered successfully:', data.user);
        setUser(data.user);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('Firebase login successful, fetching user profile for UID:', firebaseUser.uid);
      
      // Get user data from backend
      const token = await firebaseUser.getIdToken();
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/profile/${firebaseUser.uid}`), {
        headers: getApiHeaders(token)
      });
      
      console.log('Profile fetch response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('User profile fetched successfully:', data.user);
        setUser(data.user);
        return true;
      } else {
        const errorData = await response.json();
        console.error('Profile fetch failed:', errorData);
        // User exists in Firebase but not in our database
        // This shouldn't happen in normal flow, but handle gracefully
        console.log('User not found in database');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log('Firebase signup successful, registering user in backend...');
      console.log('Created Firebase user UID:', firebaseUser.uid);
      
      // Register user in our backend using the newly created Firebase user
      const success = await registerUser({
        name
      }, firebaseUser); // Pass the Firebase user directly
      
      if (success) {
        console.log('User registration successful');
      } else {
        console.error('User registration failed');
      }
      
      return success;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      firebaseUser, 
      login, 
      signup, 
      logout, 
      loading,
      registerUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};