// Performance & Loading Test

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AlbumPage from '../page-components/AlbumPage.jsx';

describe('Guest Performance Experience', () => {
  it('should show loading states during slow network', async () => {
    vi.resetModules();
    vi.doMock('../services/api', () => ({
      getAlbumMedia: vi.fn(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 1000))
      ),
      uploadMedia: vi.fn(),
    }));
    const { default: AlbumPageReloaded } = await import('../page-components/AlbumPage.jsx');
    render(<AlbumPageReloaded />);
    await screen.findByText(/Loading our beautiful memories/i, {}, { timeout: 2500 });
    await waitFor(
      () => expect(screen.queryByText(/Loading our beautiful memories/i)).not.toBeInTheDocument(),
      {
        timeout: 2500,
      }
    );
  });

  it('should handle network failures gracefully', async () => {
    vi.resetModules();
    vi.doMock('../services/api', () => ({
      getAlbumMedia: vi.fn(() => Promise.reject(new Error('Network error'))),
      uploadMedia: vi.fn(),
    }));
    const { default: AlbumPageReloaded } = await import('../page-components/AlbumPage.jsx');
    render(<AlbumPageReloaded />);
    // Wait for error message to appear
    await screen.findByText(
      /We couldn't load our photo collection right now/i,
      {},
      { timeout: 2500 }
    );
  });
});
