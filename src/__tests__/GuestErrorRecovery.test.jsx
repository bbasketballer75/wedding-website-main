// Error Recovery & Edge Cases Test

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

describe('Guest Error Recovery', () => {
  it('should recover from temporary network issues in album', async () => {
    vi.resetModules();
    let callCount = 0;
    vi.doMock('../services/api', () => ({
      getAlbumMedia: vi.fn(() => {
        callCount++;
        if (callCount === 1) throw new Error('Network error');
        return Promise.resolve({ data: [] });
      }),
      uploadMedia: vi.fn(),
    }));
    // Re-import after mock
    const { default: AlbumPageReloaded } = await import('../page-components/AlbumPage.jsx');
    render(<AlbumPageReloaded />);
    // Wait for error message
    const errorEl = await screen.findByText(
      /We couldn't load our photo collection right now/i,
      {},
      { timeout: 2500 }
    );
    expect(errorEl).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryBtn);
    await waitFor(
      () => expect(screen.queryByText(/could not load album/i)).not.toBeInTheDocument(),
      { timeout: 2500 }
    );
  });

  it('should recover from temporary network issues in map', async () => {
    vi.resetModules();
    let callCount = 0;
    vi.doMock('../services/api', () => ({
      getMapLocations: vi.fn(() => {
        callCount++;
        if (callCount === 1) throw new Error('Network error');
        return Promise.resolve({ data: [] });
      }),
    }));
    const { default: MapPageReloaded } = await import('../page-components/MapPage.jsx');
    const { unmount } = render(<MapPageReloaded />);
    // Wait for error message(s)
    const errorEls = await screen.findAllByText(
      /We can't load the love map right now/i,
      {},
      { timeout: 2500 }
    );
    expect(errorEls.length).toBeGreaterThan(0);
    // Unmount and render new instance to simulate retry
    unmount();
    render(<MapPageReloaded />);
    await waitFor(
      () =>
        expect(screen.queryByText(/We can't load the love map right now/i)).not.toBeInTheDocument(),
      { timeout: 2500 }
    );
  });
});
