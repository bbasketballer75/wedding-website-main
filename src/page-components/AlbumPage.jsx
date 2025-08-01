import React, { useState, useEffect } from 'react';
import { getAlbumMedia, uploadMedia } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';

import './AlbumPage.css';

const AlbumPage = () => {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPhotos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAlbumMedia();
      setPhotos(response.data);
    } catch {
      setError("We couldn't load our photo collection right now. Please try again in a moment!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      await uploadMedia(formData);
      setFile(null);
      const response = await getAlbumMedia();
      setPhotos(response.data);
      setIsUploading(false);
    }
  };

  return (
    <div className="album-page">
      {(isLoading || isUploading) && (
        <LoadingScreen
          message={
            isUploading
              ? 'Adding your memory to our collection...'
              : 'Loading our beautiful memories...'
          }
        />
      )}
      {!isLoading && !isUploading && error && (
        <div className="error-state">
          <div className="error-message" role="alert">
            {error}
          </div>
          <button onClick={fetchPhotos} className="btn accent retry-btn">
            Try Again
          </button>
        </div>
      )}
      {!isLoading && !isUploading && !error && (
        <>
          <h2 className="section-title">Our Memory Collection</h2>
          <p className="album-subheading">
            This is where our wedding day lives on forever! Browse through professional photos,
            candid moments, and behind-the-scenes magic. We'd love for you to add your own photos
            and videos to help us see our special day through your eyes.
          </p>
          <div className="upload-section">
            <label htmlFor="album-upload-input" className="visually-hidden">
              Share a photo or video from our wedding day
            </label>
            <input
              id="album-upload-input"
              type="file"
              onChange={handleFileChange}
              aria-label="Upload your wedding photo or video"
            />
            <button onClick={handleUpload} className="btn accent">
              Add Your Memory! 📸
            </button>
          </div>
          <div className="photo-grid">
            {photos.length === 0 ? (
              <div className="empty-state">
                This collection is just waiting for your beautiful memories! Be the first to share a
                photo or video from our special day.
              </div>
            ) : (
              photos.map((photo) => (
                <div key={photo._id} className="photo-card">
                  {photo.webpPath && photo.jpegPath ? (
                    <picture>
                      <source srcSet={`/${photo.webpPath}`} type="image/webp" />
                      <source srcSet={`/${photo.jpegPath}`} type="image/jpeg" />
                      <img src={`/${photo.jpegPath}`} alt="Wedding memory" loading="lazy" />
                    </picture>
                  ) : (
                    <img src={`/uploads/${photo.filename}`} alt="Wedding memory" loading="lazy" />
                  )}
                  <a
                    href={photo.jpegPath ? `/${photo.jpegPath}` : `/uploads/${photo.filename}`}
                    download
                    className="btn secondary download-btn"
                    aria-label="Download photo"
                  >
                    Download
                  </a>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AlbumPage;
