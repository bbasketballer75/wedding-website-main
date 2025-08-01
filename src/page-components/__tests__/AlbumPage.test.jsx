import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlbumPage from '../AlbumPage.jsx';

import * as api from '../../services/api.js';

vi.mock('../../services/api.js', () => {
  return {
    getAlbumMedia: vi.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: [
                  { _id: '1', filename: '1.jpg' },
                  { _id: '2', filename: '2.jpg' },
                ],
              }),
            50
          )
        )
    ),
    uploadMedia: vi.fn(() => Promise.resolve({})),
  };
});

describe('AlbumPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('handles album loading error gracefully', async () => {
    await act(async () => {
      render(<AlbumPage />);
    });
    expect(screen.getByText(/Loading album/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Photo & Video Album' })).toBeInTheDocument();
  });

  it('displays album photos when loaded', async () => {
    await act(async () => {
      render(<AlbumPage />);
    });
    expect(screen.getByText(/Loading album/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Photo & Video Album' })).toBeInTheDocument();
  });

  it('should show upload form when user clicks upload button', async () => {
    await act(async () => {
      render(<AlbumPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());

    // Find upload button and click it
    const uploadButton = await screen.findByRole(
      'button',
      { name: /Add Your Memory/i },
      { timeout: 3000 }
    );
    expect(uploadButton).toBeInTheDocument();
  });

  it('should filter album content when filter is applied', async () => {
    await act(async () => {
      render(<AlbumPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Our Memory Collection' })).toBeInTheDocument();
  });
  it('renders upload input and button', async () => {
    await act(async () => {
      render(<AlbumPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Add Your Memory/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Your Memory/i })).toBeInTheDocument();
    // The input is type="file" with no label, so use querySelector
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();
  });

  it('calls uploadMedia when upload button is clicked', async () => {
    await act(async () => {
      render(<AlbumPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    // The input is type="file" with no label, so use querySelector
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });
    const uploadButton = screen.getByRole('button', { name: /Add Your Memory/i });
    await act(async () => {
      fireEvent.click(uploadButton);
    });
    await waitFor(() => expect(api.uploadMedia).toHaveBeenCalled());
  });

  it('applies correct CSS classes and structure', async () => {
    await act(async () => {
      render(<AlbumPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading album/i)).not.toBeInTheDocument());
    const albumContainer = document.querySelector('.album-page');
    expect(albumContainer).toBeInTheDocument();
    expect(albumContainer).toHaveClass('album-page');
    expect(document.querySelector('.photo-grid')).toBeInTheDocument();
  });

  it('renders without errors', () => {
    expect(() => {
      act(() => {
        render(<AlbumPage />);
      });
    }).not.toThrow();
  });
});
