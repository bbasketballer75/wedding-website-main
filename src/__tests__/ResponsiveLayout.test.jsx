// Mobile/Responsive Experience Test

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';

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
    
    // Wait for landing page to load
    await act(async () => {
      await screen.findByText(/austin & jordyn/i, {}, { timeout: 2000 });
    });
    
    // Simulate entering the site (click enter button)
    await act(async () => {
      const enterBtn = screen.getByRole('button', { name: /enter wedding site/i });
      enterBtn.click();
    });
    
    // Wait for nav to appear
    await act(async () => {
      await screen.findByLabelText(/toggle navigation/i, {}, { timeout: 2000 });
    });
    
    // Should show hamburger/toggle button
    expect(screen.getByLabelText(/toggle navigation/i)).toBeInTheDocument();
  });

  it('should show readable text on small screens', async () => {
    await act(async () => {
      render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </MemoryRouter>
      );
    });
    
    // Wait for loading to finish
    await act(async () => {
      await screen.findByText(/austin & jordyn/i, {}, { timeout: 2000 });
    });
    
    // Should show main headings with readable font size
    expect(screen.getByText(/austin & jordyn/i)).toBeInTheDocument();
    expect(screen.getByText(/our wedding celebration/i)).toBeInTheDocument();
  });
});
