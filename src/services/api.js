import axios from 'axios';

const API_URL =
  typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : 'https://www.theporadas.com/api';

export const getAlbumMedia = () => {
  return axios.get(`${API_URL}/album`);
};

export const uploadMedia = (formData) => {
  return axios.post(`${API_URL}/album/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getGuestbookEntries = () => {
  return axios.get(`${API_URL}/guestbook`);
};

export const createGuestbookEntry = (entry) => {
  return axios.post(`${API_URL}/guestbook`, entry);
};

export const getMapLocations = () => {
  return axios.get(`${API_URL}/map/locations`);
};

export const logVisit = () => {
  return axios.post(`${API_URL}/map/log-visit`);
};

export const getAllAlbumMedia = (adminKey) => {
  return axios.get(`${API_URL}/album/all`, { headers: { Authorization: `Bearer ${adminKey}` } });
};

export const moderateMedia = (photoId, isApproved, adminKey) => {
  return axios.post(
    `${API_URL}/album/moderate`,
    { photoId, isApproved },
    { headers: { Authorization: `Bearer ${adminKey}` } }
  );
};

// ... other api functions can be added here
