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
  registerUser: (userData: Partial<User>) => Promise<boolean>;
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
        // Get user data from backend
        try {
          const token = await firebaseUser.getIdToken();
          const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/profile/${firebaseUser.uid}`), {
            headers: getApiHeaders(token)
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // User exists in Firebase but not in our database
            console.log('User not found in database');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const registerUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!firebaseUser) return false;

      const token = await firebaseUser.getIdToken();
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.AUTH + '/register'), {
        method: 'POST',
        headers: getApiHeaders(token),
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user data from backend
      const token = await firebaseUser.getIdToken();
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.AUTH}/profile/${firebaseUser.uid}`), {
        headers: getApiHeaders(token)
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return true;
      } else {
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
      
      // Register user in our backend
      const success = await registerUser({
        email,
        name,
        firebaseUid: firebaseUser.uid
      });
      
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