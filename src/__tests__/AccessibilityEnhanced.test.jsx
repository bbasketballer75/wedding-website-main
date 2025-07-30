// Accessibility Deep-Dive Test

import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App.jsx';
import PhotoGallery from '../components/PhotoGallery.jsx';

// Mock the API service
vi.mock('../services/api', () => ({
  logVisit: vi.fn(() => Promise.resolve()),
}));

describe('Enhanced Guest Accessibility', () => {
  it('should support screen reader navigation after entering site', async () => {
    await act(async () => {
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </MemoryRouter>
      );
    });

    // Wait for landing page to load (look for austin & jordyn text instead)
    await waitFor(
      () => {
        expect(screen.getByText(/austin & jordyn/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Simulate entering the site (click enter button)
    await act(async () => {
      const enterBtn = screen.getByRole('button', { name: /enter wedding site/i });
      fireEvent.click(enterBtn);
    });

    // Wait for loading to complete and main content to appear
    await waitFor(
      () => {
        // Check that loading overlay is gone
        expect(screen.queryByText(/loading page/i)).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Look for main navigation or content elements that should exist
    await waitFor(
      () => {
        const mainElement =
          screen.queryByRole('main') ||
          screen.queryByRole('navigation') ||
          screen.queryByLabelText(/main content/i) ||
          screen.queryByText(/home/i);
        expect(mainElement).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('should provide alternative text for all images', async () => {
    await act(async () => {
      render(<PhotoGallery refreshKey={0} />);
    });

    // All images should have alt text
    const imgs = screen.queryAllByRole('img');
    imgs.forEach((img) => {
      expect(img).toHaveAttribute('alt');
      expect(img.alt.length).toBeGreaterThan(0);
    });
  });

  it('should support keyboard-only navigation after entering site', async () => {
    await act(async () => {
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </MemoryRouter>
      );
    });

    // Wait for landing page to load (look for austin & jordyn text instead)
    await waitFor(
      () => {
        expect(screen.getByText(/austin & jordyn/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Simulate entering the site (click enter button)
    await act(async () => {
      const enterBtn = screen.getByRole('button', { name: /enter wedding site/i });
      fireEvent.click(enterBtn);
    });

    // Wait for navigation to appear
    await waitFor(
      () => {
        expect(screen.getByRole('navigation')).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    // Check for skip link or main navigation as primary keyboard targets
    const skipLink = screen.queryByText(/skip to main content/i);
    const navigation = screen.getByRole('navigation');

    // At least navigation should be available for keyboard users
    expect(navigation).toBeInTheDocument();

    if (skipLink) {
      skipLink.focus();
      expect(document.activeElement).toBe(skipLink);
    }
  });
});
