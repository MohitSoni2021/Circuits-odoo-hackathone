// API Configuration
export const API_CONFIG = {
  // Development
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-api.com' 
    : 'http://localhost:5001',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: '/api/auth',
    ITEMS: '/api/items',
    SWAPS: '/api/swaps',
    HEALTH: '/health'
  }
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Common API headers
export const getApiHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}; 