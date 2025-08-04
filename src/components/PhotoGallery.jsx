import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getAlbumMedia } from '../services/api';
import { analyticsManager } from '../services/analyticsManager';
import './PhotoGallery.css';

const PhotoGallery = ({ refreshKey }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [hasMoreToLoad, setHasMoreToLoad] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isMountedRef = useRef(true);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Lazy loading intersection observer
  useEffect(() => {
    if (!window.IntersectionObserver) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img && img.dataset && img.dataset.src;
            if (src && !loadedImages.has(src)) {
              img.src = src;
              img.classList.add('loading');
              observerRef.current.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1,
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadedImages]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMoreToLoad || !loadMoreRef.current) return;

    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreContent();
        }
      },
      { threshold: 0.1 }
    );

    loadMoreObserver.observe(loadMoreRef.current);

    return () => loadMoreObserver.disconnect();
  }, [hasMoreToLoad, isLoadingMore]);

  const fetchMedia = useCallback(
    async (offset = 0, limit = 20) => {
      try {
        setIsLoading(offset === 0);
        setIsLoadingMore(offset > 0);
        setError(null);

        const response = await getAlbumMedia({ offset, limit });

        if (isMountedRef.current) {
          const newMedia = response.data || [];

          if (offset === 0) {
            setMedia(newMedia);
            analyticsManager.trackEvent('photo_gallery_loaded', {
              totalPhotos: newMedia.length,
              loadTime: performance.now(),
            });
          } else {
            setMedia((prev) => [...prev, ...newMedia]);
            analyticsManager.trackEvent('photo_gallery_load_more', {
              newPhotos: newMedia.length,
              totalPhotos: media.length + newMedia.length,
            });
          }

          setHasMoreToLoad(newMedia.length === limit);
          setRetryCount(0);
        }
      } catch (err) {
        console.error('Error fetching album media:', err);

        if (isMountedRef.current) {
          let errorMessage;
          if (err.response?.status === 404) {
            errorMessage = 'Album not found. Please check back later.';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. Please try again in a few moments.';
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            errorMessage = 'Network connection issue. Please check your internet connection.';
          } else {
            errorMessage = 'Could not fetch the album. Please try again later.';
          }

          setError(errorMessage);
          analyticsManager.trackEvent('photo_gallery_error', {
            error: err.message,
            status: err.response?.status,
            retryCount,
          });
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [retryCount, media.length]
  );

  const loadMoreContent = useCallback(() => {
    if (!isLoadingMore && hasMoreToLoad) {
      fetchMedia(media.length, 20);
    }
  }, [fetchMedia, media.length, isLoadingMore, hasMoreToLoad]);

  useEffect(() => {
    fetchMedia(0, 20);
  }, [refreshKey, retryCount]);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const handleImageLoad = useCallback((e, itemId) => {
    const img = e.target;
    img.classList.remove('loading');
    img.classList.add('loaded');

    setLoadedImages((prev) => new Set([...prev, img.src]));

    analyticsManager.trackEvent('photo_loaded', {
      photoId: itemId,
      loadTime: performance.now(),
    });
  }, []);

  const handleImageError = useCallback((e, itemId) => {
    e.target.closest('.lazy-image-container').innerHTML = `
      <div class="image-error">
        <span>Failed to load image</span>
      </div>
    `;

    analyticsManager.trackEvent('photo_load_error', {
      photoId: itemId,
      error: 'Image failed to load',
    });
  }, []);

  const handlePhotoClick = useCallback((item, index) => {
    analyticsManager.trackEvent('photo_clicked', {
      photoId: item._id,
      photoIndex: index,
      timestamp: item.timestamp,
    });
  }, []);

  // Observe images for lazy loading
  const observeImage = useCallback((img) => {
    if (img && observerRef.current) {
      observerRef.current.observe(img);
    }
  }, []);

  if (isLoading && media.length === 0) {
    return (
      <div className="photo-gallery" aria-live="polite">
        <div className="gallery-header">
          <h2>Our Wedding Album</h2>
          <p className="gallery-stats">Loading precious memories...</p>
        </div>
        <div className="loading-grid">
          {Array.from({ length: 6 }, (_, i) => (
            <section key={i} className="loading-placeholder" aria-label={`Loading photo ${i + 1}`}>
              <div className="image-placeholder">
                <div className="placeholder-shimmer"></div>
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  if (error && media.length === 0) {
    return (
      <div className="photo-gallery" role="alert" aria-live="assertive">
        <div className="photo-gallery error">
          <h3>Unable to Load Photos</h3>
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-button" aria-label="Retry loading album">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="photo-gallery" aria-label="Wedding photo gallery">
      <div className="gallery-header">
        <h2>Our Wedding Album</h2>
        {media.length > 0 && (
          <p className="gallery-stats">
            {media.length} beautiful {media.length === 1 ? 'memory' : 'memories'} shared
          </p>
        )}
      </div>

      {media.length === 0 ? (
        <div className="photo-gallery empty">
          <h3>No Photos Yet</h3>
          <p>Be the first to share a beautiful memory from our special day!</p>
        </div>
      ) : (
        <>
          <div className="photo-grid">
            {media.map((item, index) => (
              <button
                key={item._id}
                className="photo-item"
                onClick={() => handlePhotoClick(item, index)}
                aria-label={`Wedding photo ${index + 1}, uploaded ${new Date(item.timestamp).toLocaleDateString()}`}
                type="button"
              >
                {item.mimetype.startsWith('image/') && (
                  <div className="lazy-image-container">
                    <img
                      ref={observeImage}
                      data-src={`/${item.filepath}`}
                      alt={`Wedding memory ${index + 1}, uploaded ${new Date(item.timestamp).toLocaleDateString()}`}
                      className="lazy-image loading"
                      onLoad={(e) => handleImageLoad(e, item._id)}
                      onError={(e) => handleImageError(e, item._id)}
                    />
                  </div>
                )}

                {item.mimetype.startsWith('video/') && (
                  <video
                    src={`/${item.filepath}`}
                    controls
                    muted
                    loop
                    playsInline
                    className="lazy-image"
                    aria-label={`Wedding video ${index + 1}, uploaded ${new Date(item.timestamp).toLocaleDateString()}`}
                    onLoadStart={() =>
                      analyticsManager.trackEvent('video_load_start', { videoId: item._id })
                    }
                    onCanPlay={() =>
                      analyticsManager.trackEvent('video_ready', { videoId: item._id })
                    }
                  >
                    <p>Your browser does not support the video tag.</p>
                  </video>
                )}

                <div className="photo-caption">
                  <div className="caption-content">
                    <small className="upload-date">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </small>
                    {item.uploadedBy && item.uploadedBy !== 'Anonymous Guest' && (
                      <small className="uploaded-by">Shared by {item.uploadedBy}</small>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {hasMoreToLoad && (
            <div ref={loadMoreRef} className="load-more-indicator">
              {isLoadingMore ? (
                <>
                  <div className="loading-spinner" aria-hidden="true"></div>
                  <p>Loading more memories...</p>
                </>
              ) : (
                <p>Scroll down for more photos</p>
              )}
            </div>
          )}

          {!hasMoreToLoad && media.length > 0 && (
            <div className="gallery-end">
              <p>You've seen all our beautiful memories! 💕</p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

PhotoGallery.propTypes = {
  refreshKey: PropTypes.number,
};

PhotoGallery.defaultProps = {
  refreshKey: 0,
};

export default PhotoGallery;
