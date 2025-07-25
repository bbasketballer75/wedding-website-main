import React, { useState, useEffect, useCallback } from 'react';
import { getAllAlbumMedia, moderateMedia } from '../services/api';
import ModerationCard from './ModerationCard';
import './AdminDashboard.css';

const AdminDashboard = ({ adminKey }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modAction, setModAction] = useState({}); // { [id]: 'pending' | 'success' | 'error' }

  useEffect(() => {
    const fetchAllMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllAlbumMedia(adminKey);
        setMedia(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch media. Is the admin key correct?');
        // ...existing code...
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllMedia();
  }, [adminKey]);

  const handleModeration = useCallback(
    async (photoId, isApproved) => {
      setModAction((prev) => ({ ...prev, [photoId]: 'pending' }));
      setSuccess(null);
      try {
        await moderateMedia(photoId, isApproved, adminKey);
        setMedia((prevMedia) =>
          prevMedia.map((item) => (item._id === photoId ? { ...item, approved: isApproved } : item))
        );
        setModAction((prev) => ({ ...prev, [photoId]: 'success' }));
        setSuccess(isApproved ? 'Media approved.' : 'Media denied and removed.');
      } catch (err) {
        setModAction((prev) => ({ ...prev, [photoId]: 'error' }));
        setError('Failed to update status. Please try again.');
        // ...existing code...
      }
    },
    [adminKey]
  );

  if (isLoading)
    return (
      <div className="loading" role="status" aria-live="polite">
        Loading submissions...
      </div>
    );
  if (error)
    return (
      <div className="error-message" role="alert">
        {error}
      </div>
    );

  return (
    <div className="admin-dashboard" aria-label="Admin moderation dashboard">
      {success && (
        <div className="form-success" role="status">
          {success}
        </div>
      )}
      {media.length === 0 ? (
        <div className="empty-state" role="status">
          No submissions to moderate.
        </div>
      ) : (
        media.map((item) => (
          <ModerationCard
            key={item._id}
            item={item}
            modAction={modAction}
            handleModeration={handleModeration}
          />
        ))
      )}
    </div>
  );
};

export default AdminDashboard;
