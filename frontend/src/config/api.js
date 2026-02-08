// API Configuration
// Uses environment variables to support different environments (dev, production)

const getApiBaseUrl = () => {
  // In development, use localhost
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }
  
  // In production, use environment variable
  // If backend is deployed separately, set VITE_API_URL in Vercel to your backend URL
  // Example: https://your-backend.vercel.app or https://api.yourdomain.com
  return import.meta.env.VITE_API_URL || '';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // If API_BASE_URL is empty (not set), return relative path
  if (!API_BASE_URL) {
    return `/${cleanEndpoint}`;
  }
  
  // Ensure no double slashes
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${base}/${cleanEndpoint}`;
};

// API endpoints
export const API_ENDPOINTS = {
  COMPARE: buildApiUrl('api/compare'),
  SUGGESTIONS: buildApiUrl('api/compare/suggestions'),
};

