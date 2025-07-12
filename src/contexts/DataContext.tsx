import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getApiUrl, getApiHeaders, API_CONFIG } from '../config/api';

export interface ClothingItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  tags: string[];
  images: string[];
  uploaderId: string;
  uploaderName: string;
  pointsRequired: number;
  status: 'available' | 'pending' | 'swapped';
  approved: boolean;
  createdAt: string;
}

export interface SwapRequest {
  _id: string;
  fromUserId: string;
  toUserId: string;
  itemId: string;
  offerItemId?: string;
  pointsOffered?: number;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: string;
}

interface DataContextType {
  items: ClothingItem[];
  swapRequests: SwapRequest[];
  loading: boolean;
  addItem: (item: Omit<ClothingItem, '_id' | 'createdAt' | 'approved' | 'status'> & { images: File[] | string[] }) => Promise<boolean>;
  updateItem: (id: string, updates: Partial<ClothingItem>) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
  createSwapRequest: (request: Omit<SwapRequest, '_id' | 'createdAt'>) => Promise<boolean>;
  updateSwapRequest: (id: string, status: SwapRequest['status']) => Promise<boolean>;
  getUserItems: (userId: string) => ClothingItem[];
  getUserSwapRequests: (userId: string) => SwapRequest[];
  fetchItems: () => Promise<void>;
  fetchSwapRequests: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { firebaseUser } = useAuth();

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    if (!firebaseUser) {
      return { 'Content-Type': 'application/json' };
    }
    const token = await firebaseUser.getIdToken();
    return getApiHeaders(token);
  };

  const fetchItems = async () => {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ITEMS));
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchSwapRequests = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SWAPS), {
        headers
      });
      if (response.ok) {
        const data = await response.json();
        setSwapRequests(data.swapRequests);
      }
    } catch (error) {
      console.error('Error fetching swap requests:', error);
    }
  };

  useEffect(() => {
    fetchItems();
    if (firebaseUser) {
      fetchSwapRequests();
    }
    setLoading(false);
  }, [firebaseUser]);

  const addItem = async (newItem: Omit<ClothingItem, '_id' | 'createdAt' | 'approved' | 'status'> & { images: File[] | string[] }): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      
      // Create FormData for multipart/form-data
      const formData = new FormData();
      
      // Add all item data as JSON string
      const itemData = {
        title: newItem.title,
        description: newItem.description,
        category: newItem.category,
        type: newItem.type,
        size: newItem.size,
        condition: newItem.condition,
        tags: newItem.tags,
        pointsRequired: newItem.pointsRequired,
        uploaderId: newItem.uploaderId,
        uploaderName: newItem.uploaderName
      };
      
      formData.append('data', JSON.stringify(itemData));
      
      // Add images if they are File objects
      if (newItem.images && newItem.images.length > 0) {
        newItem.images.forEach((image) => {
          if (typeof image === 'object' && 'name' in image && 'type' in image) {
            formData.append('images', image as File);
          }
        });
      }
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.ITEMS), {
        method: 'POST',
        headers: {
          'Authorization': headers.Authorization
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setItems(prev => [...prev, data.item]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding item:', error);
      return false;
    }
  };

  const updateItem = async (id: string, updates: Partial<ClothingItem>): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.ITEMS}/${id}`), {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        setItems(prev => prev.map(item => item._id === id ? { ...item, ...updates } : item));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating item:', error);
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.ITEMS}/${id}`), {
        method: 'DELETE',
        headers
      });

      if (response.ok) {
        setItems(prev => prev.filter(item => item._id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  };

  const createSwapRequest = async (newRequest: Omit<SwapRequest, '_id' | 'createdAt'>): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SWAPS), {
        method: 'POST',
        headers,
        body: JSON.stringify(newRequest)
      });

      if (response.ok) {
        const data = await response.json();
        setSwapRequests(prev => [...prev, data.swapRequest]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating swap request:', error);
      return false;
    }
  };

  const updateSwapRequest = async (id: string, status: SwapRequest['status']): Promise<boolean> => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(`${API_CONFIG.ENDPOINTS.SWAPS}/${id}`), {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setSwapRequests(prev => prev.map(req => req._id === id ? { ...req, status } : req));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating swap request:', error);
      return false;
    }
  };

  const getUserItems = (userId: string) => {
    return items.filter(item => item.uploaderId === userId);
  };

  const getUserSwapRequests = (userId: string) => {
    return swapRequests.filter(req => req.fromUserId === userId || req.toUserId === userId);
  };

  return (
    <DataContext.Provider value={{
      items,
      swapRequests,
      loading,
      addItem,
      updateItem,
      deleteItem,
      createSwapRequest,
      updateSwapRequest,
      getUserItems,
      getUserSwapRequests,
      fetchItems,
      fetchSwapRequests
    }}>
      {children}
    </DataContext.Provider>
  );
};