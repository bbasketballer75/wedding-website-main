import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getAlbumMedia } from '../services/api';
import { analyticsManager } from '../services/analyticsManager';
import './PhotoGallery.css';

// Lazy Image Component with progressive loading
const LazyImage = ({ src, alt, category, id, onView, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // Check if IntersectionObserver is available (polyfill for tests)
    if (typeof IntersectionObserver === 'undefined') {
      // Fallback for testing environments or old browsers
      setIsInView(true);
      analyticsManager.trackPhotoView(id, category);
      onView?.(id, category);
      return;
    }

    // Create intersection observer for this image
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true);
          // Track photo view
          analyticsManager.trackPhotoView(id, category);
          onView?.(id, category);

          // Disconnect observer after first view
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [id, category, isInView, onView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setError(false);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    analyticsManager.trackEvent('image_load_error', { src, id });
  }, [src, id]);

  return (
    <div ref={imgRef} className={`lazy-image-container ${className || ''}`}>
      {/* Placeholder while loading */}
      {!isLoaded && !error && (
        <div className="image-placeholder">
          <div className="placeholder-shimmer"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="image-error">
          <span>Failed to load image</span>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          loading="lazy"
        />
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onView: PropTypes.func,
  className: PropTypes.string,
};

// Enhanced Photo Gallery with lazy loading
const PhotoGallery = ({ refreshKey }) => {
  const [media, setMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [visibleItems, setVisibleItems] = useState(12); // Start with 12 items
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isMountedRef = useRef(true);
  const galleryRef = useRef(null);
  const loadMoreObserverRef = useRef(null);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      loadMoreObserverRef.current?.disconnect();
    };
  }, []);

  // Fetch media data
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);

        analyticsManager.trackEvent('photo_gallery_load_start');
        const response = await getAlbumMedia();

        if (isMountedRef.current) {
          setMedia(response.data);
          setRetryCount(0);
          analyticsManager.trackEvent('photo_gallery_load_success', {
            totalPhotos: response.data.length,
          });
        }
      } catch (err) {
        console.error('Error fetching album media:', err);
        analyticsManager.trackEvent('photo_gallery_load_error', {
          error: err.message,
          retryCount,
        });

        if (isMountedRef.current) {
          if (err.response?.status === 404) {
            setError('Album not found. Please check back later.');
          } else if (err.response?.status >= 500) {
            setError('Server error. Please try again in a few moments.');
          } else if (err.code === 'NETWORK_ERROR' || !err.response) {
            setError('Network connection issue. Please check your internet connection.');
          } else {
            setError('Could not fetch the album. Please try again later.');
          }
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchMedia();
  }, [refreshKey, retryCount]);

  // Setup infinite scrolling
  useEffect(() => {
    if (!galleryRef.current || media.length <= visibleItems) return;

    const lastItem = galleryRef.current.children[visibleItems - 1];
    if (!lastItem) return;

    loadMoreObserverRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    loadMoreObserverRef.current.observe(lastItem);

    return () => {
      loadMoreObserverRef.current?.disconnect();
    };
  }, [visibleItems, media.length, isLoadingMore]);

  const loadMoreItems = useCallback(() => {
    if (visibleItems >= media.length) return;

    setIsLoadingMore(true);
    analyticsManager.trackEvent('photo_gallery_load_more');

    // Simulate loading delay for better UX
    setTimeout(() => {
      setVisibleItems((prev) => Math.min(prev + 12, media.length));
      setIsLoadingMore(false);
    }, 300);
  }, [visibleItems, media.length]);

  const handlePhotoView = useCallback((photoId, category) => {
    // Additional tracking can be added here
    console.log(`Photo viewed: ${photoId} in ${category}`);
  }, []);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
    analyticsManager.trackEvent('photo_gallery_retry', { retryCount: retryCount + 1 });
  }, [retryCount]);

  if (isLoading) {
    return (
      <div className="photo-gallery-loading" aria-label="Loading photos">
        <div className="loading-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="loading-placeholder">
              <div className="placeholder-shimmer"></div>
            </div>
          ))}
        </div>
        <p className="loading-text">Loading our beautiful memories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="photo-gallery-error" role="alert">
        <h3>Unable to load photos</h3>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button" aria-label="Retry loading photos">
          Try Again
        </button>
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="photo-gallery-empty">
        <h3>No photos yet</h3>
        <p>Photos will appear here as they're uploaded to our wedding album.</p>
      </div>
    );
  }

  const visibleMedia = media.slice(0, visibleItems);

  return (
    <div className="photo-gallery-enhanced">
      <div className="gallery-header">
        <h2>Our Photo Album</h2>
        <p className="gallery-stats">
          Showing {visibleItems} of {media.length} photos
        </p>
      </div>

      <div ref={galleryRef} className="photo-grid" role="grid" aria-label="Wedding photo gallery">
        {visibleMedia.map((item, index) => (
          <div key={item.id || index} className="photo-item">
            <LazyImage
              src={item.url}
              alt={item.caption || `Wedding photo ${index + 1}`}
              category={item.category || 'general'}
              id={item.id || `photo-${index}`}
              onView={handlePhotoView}
              className="gallery-image"
            />
            {item.caption && <div className="photo-caption">{item.caption}</div>}
          </div>
        ))}
      </div>

      {/* Load more indicator */}
      {isLoadingMore && (
        <div className="load-more-indicator" aria-label="Loading more photos">
          <div className="loading-spinner"></div>
          <p>Loading more photos...</p>
        </div>
      )}

      {/* End of gallery message */}
      {visibleItems >= media.length && media.length > 12 && (
        <div className="gallery-end">
          <p>You've seen all our photos! 💕</p>
        </div>
      )}
    </div>
  );
};

PhotoGallery.propTypes = {
  refreshKey: PropTypes.number,
};

export default PhotoGallery;
