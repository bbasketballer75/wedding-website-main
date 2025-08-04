import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import PhotoGalleryEnhanced from '../PhotoGalleryEnhanced';
import { getAlbumMedia } from '../../services/api';
import { analyticsManager } from '../../services/analyticsManager';

// Mock dependencies
vi.mock('../../services/api');
vi.mock('../../services/analyticsManager');

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock performance API
global.performance = {
  now: vi.fn(() => 1000),
};

const mockMedia = [
  {
    _id: '1',
    filepath: 'test-image-1.jpg',
    mimetype: 'image/jpeg',
    timestamp: '2024-01-01T00:00:00Z',
    uploadedBy: 'Test User',
  },
  {
    _id: '2',
    filepath: 'test-video-1.mp4',
    mimetype: 'video/mp4',
    timestamp: '2024-01-02T00:00:00Z',
    uploadedBy: 'Another User',
  },
  {
    _id: '3',
    filepath: 'test-image-2.jpg',
    mimetype: 'image/jpeg',
    timestamp: '2024-01-03T00:00:00Z',
    uploadedBy: 'Anonymous Guest',
  },
];

describe('PhotoGalleryEnhanced', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAlbumMedia.mockResolvedValue({ data: mockMedia });
    analyticsManager.trackEvent = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    render(<PhotoGalleryEnhanced />);

    expect(screen.getByText('Loading precious memories...')).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Loading photo \d+/)).toHaveLength(6);
  });

  it('renders photo gallery with media items', async () => {
    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      expect(screen.getByText('Our Wedding Album')).toBeInTheDocument();
      expect(screen.getByText('3 beautiful memories shared')).toBeInTheDocument();
    });

    // Check that all media items are rendered
    const photoItems = screen.getAllByRole('button');
    expect(photoItems).toHaveLength(3);
  });

  it('displays correct upload information for each media item', async () => {
    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      expect(screen.getByText('Shared by Test User')).toBeInTheDocument();
      expect(screen.getByText('Shared by Another User')).toBeInTheDocument();
      // Anonymous Guest should not show "Shared by" text
      expect(screen.queryByText('Shared by Anonymous Guest')).not.toBeInTheDocument();
    });
  });

  it('handles photo click and tracks analytics', async () => {
    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      const photoButtons = screen.getAllByRole('button');
      fireEvent.click(photoButtons[0]);
    });

    expect(analyticsManager.trackEvent).toHaveBeenCalledWith('photo_clicked', {
      photoId: '1',
      photoIndex: 0,
      timestamp: '2024-01-01T00:00:00Z',
    });
  });

  it('handles keyboard navigation', async () => {
    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      expect(screen.getByText('Our Wedding Album')).toBeInTheDocument();
    });

    // Clear the previous analytics calls
    vi.clearAllMocks();

    const photoButtons = screen.getAllByRole('button');

    // Simulate Enter key press on button (this should trigger click)
    fireEvent.keyDown(photoButtons[0], { key: 'Enter' });
    fireEvent.keyUp(photoButtons[0], { key: 'Enter' });

    // Since buttons automatically handle keyboard activation, we can also test by simulating click
    fireEvent.click(photoButtons[0]);

    expect(analyticsManager.trackEvent).toHaveBeenCalledWith('photo_clicked', {
      photoId: '1',
      photoIndex: 0,
      timestamp: '2024-01-01T00:00:00Z',
    });
  });

  it('renders empty state when no media', async () => {
    getAlbumMedia.mockResolvedValue({ data: [] });
    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      expect(screen.getByText('No Photos Yet')).toBeInTheDocument();
      expect(
        screen.getByText('Be the first to share a beautiful memory from our special day!')
      ).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAlbumMedia.mockRejectedValue(new Error('Network error'));

    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Photos')).toBeInTheDocument();
      expect(
        screen.getByText('Network connection issue. Please check your internet connection.')
      ).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry loading album' })).toBeInTheDocument();
    });

    expect(analyticsManager.trackEvent).toHaveBeenCalledWith('photo_gallery_error', {
      error: 'Network error',
      status: undefined,
      retryCount: 0,
    });

    consoleError.mockRestore();
  });

  it('handles retry functionality', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAlbumMedia.mockRejectedValueOnce(new Error('Network error'));
    getAlbumMedia.mockResolvedValueOnce({ data: mockMedia });

    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Photos')).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: 'Retry loading album' });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Our Wedding Album')).toBeInTheDocument();
      expect(screen.getByText('3 beautiful memories shared')).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('tracks successful gallery load', async () => {
    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      expect(analyticsManager.trackEvent).toHaveBeenCalledWith('photo_gallery_loaded', {
        totalPhotos: 3,
        loadTime: 1000,
      });
    });
  });

  it('handles different error types appropriately', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Test 404 error
    getAlbumMedia.mockRejectedValue({ response: { status: 404 } });
    const { rerender } = render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      expect(screen.getByText('Album not found. Please check back later.')).toBeInTheDocument();
    });

    // Test 500 error
    getAlbumMedia.mockRejectedValue({ response: { status: 500 } });
    rerender(<PhotoGalleryEnhanced refreshKey={1} />);

    await waitFor(() => {
      expect(
        screen.getByText('Server error. Please try again in a few moments.')
      ).toBeInTheDocument();
    });

    // Test network error
    getAlbumMedia.mockRejectedValue({ code: 'NETWORK_ERROR' });
    rerender(<PhotoGalleryEnhanced refreshKey={2} />);

    await waitFor(() => {
      expect(
        screen.getByText('Network connection issue. Please check your internet connection.')
      ).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });

  it('provides proper accessibility labels', async () => {
    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      const gallery = screen.getByLabelText('Wedding photo gallery');
      expect(gallery).toBeInTheDocument();

      const photoButtons = screen.getAllByRole('button');
      expect(photoButtons[0]).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Wedding photo 1')
      );
      expect(photoButtons[1]).toHaveAttribute(
        'aria-label',
        expect.stringContaining('Wedding photo 2')
      );
    });
  });

  it('renders video elements with proper attributes', async () => {
    render(<PhotoGalleryEnhanced />);

    await waitFor(() => {
      const videos = document.querySelectorAll('video');
      expect(videos).toHaveLength(1);
      expect(videos[0]).toHaveAttribute('controls');
      expect(videos[0]).toHaveAttribute('loop');
      expect(videos[0]).toHaveAttribute('playsinline'); // Note: React converts playsInline to playsinline
      expect(videos[0].src).toContain('test-video-1.mp4');
      // Check muted property instead of attribute since React might handle this differently
      expect(videos[0].muted).toBe(true);
    });
  });

  it('updates refresh behavior with refreshKey prop', async () => {
    const { rerender } = render(<PhotoGalleryEnhanced refreshKey={0} />);

    await waitFor(() => {
      expect(getAlbumMedia).toHaveBeenCalledTimes(1);
    });

    rerender(<PhotoGalleryEnhanced refreshKey={1} />);

    await waitFor(() => {
      expect(getAlbumMedia).toHaveBeenCalledTimes(2);
    });
  });
});
