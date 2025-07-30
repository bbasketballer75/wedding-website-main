import axios from 'axios';

// Handle API URL for different environments
const getApiUrl = () => {
  // During build time (SSG), API_URL might not be available
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // During runtime in browser, check for Next.js public env vars
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fallback for production
  if (typeof window !== 'undefined') {
    return 'https://wedding-backend.netlify.app/.netlify/functions';
  }

  // During build time, return empty string to avoid build errors
  console.warn('API_URL not available during build time - this is expected for SSG');
  return '';
};

const API_URL = getApiUrl();

// Helper function to check if API is available
const checkApiAvailable = () => {
  if (!API_URL) {
    return Promise.reject(new Error('API not available during build time'));
  }
  return true;
};

export const getAlbumMedia = () => {
  checkApiAvailable();
  return axios.get(`${API_URL}/album`);
};

export const uploadMedia = (formData) => {
  checkApiAvailable();
  return axios.post(`${API_URL}/album/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getGuestbookEntries = () => {
  checkApiAvailable();
  return axios.get(`${API_URL}/guestbook`);
};

export const createGuestbookEntry = (entry) => {
  checkApiAvailable();
  return axios.post(`${API_URL}/guestbook`, entry);
};

export const getMapLocations = () => {
  checkApiAvailable();
  return axios.get(`${API_URL}/map/locations`);
};

export const logVisit = () => {
  if (!API_URL) {
    // Silently fail during build time
    return Promise.resolve();
  }
  return axios.post(`${API_URL}/map/log-visit`);
};

export const getAllAlbumMedia = (adminKey) => {
  checkApiAvailable();
  return axios.get(`${API_URL}/album/all`, { headers: { Authorization: `Bearer ${adminKey}` } });
};

export const moderateMedia = (photoId, isApproved, adminKey) => {
  checkApiAvailable();
  return axios.post(
    `${API_URL}/album/moderate`,
    { photoId, isApproved },
    { headers: { Authorization: `Bearer ${adminKey}` } }
  );
};

// ... other api functions can be added here
