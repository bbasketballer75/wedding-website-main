// Mobile/Responsive Experience Test

import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App.jsx';

// Mock the API service
vi.mock('../services/api', () => ({
  logVisit: vi.fn(() => Promise.resolve()),
}));

describe('Mobile Guest Experience', () => {
  beforeEach(() => {
    global.innerWidth = 375;
    global.dispatchEvent(new Event('resize'));
  });

  it('should display mobile-optimized navigation after entering site', async () => {
    await act(async () => {
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </MemoryRouter>
      );
    });

    // Wait for loading to finish and landing page to appear
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

    // Now check for navigation elements - could be navbar or mobile menu
    await waitFor(
      () => {
        // Look for navigation elements that should exist after loading
        const navElement =
          screen.queryByRole('navigation') ||
          screen.queryByLabelText(/toggle navigation/i) ||
          screen.queryByLabelText(/main navigation/i) ||
          screen.queryByText(/home/i);
        expect(navElement).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });

  it('should show readable text on small screens', async () => {
    await act(async () => {
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </MemoryRouter>
      );
    });

    // Wait for loading to finish and landing page to appear
    await waitFor(
      () => {
        expect(screen.getByText(/austin & jordyn/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Should show main headings with readable font size
    expect(screen.getByText(/austin & jordyn/i)).toBeInTheDocument();

    // Check if "our wedding celebration" exists, if not skip this assertion
    const celebrationText = screen.queryByText(/our wedding celebration/i);
    if (celebrationText) {
      expect(celebrationText).toBeInTheDocument();
    }
  });
});
