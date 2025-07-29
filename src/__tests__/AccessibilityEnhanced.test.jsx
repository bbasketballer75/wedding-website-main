// Accessibility Deep-Dive Test

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App.jsx';
import PhotoGallery from '../components/PhotoGallery.jsx';

describe('Enhanced Guest Accessibility', () => {
  it('should support screen reader navigation after entering site', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Wait for landing page to load
    await screen.findByText(/thank you/i, {}, { timeout: 2000 });
    // Simulate entering the site (click enter button)
    const enterBtn = screen.getByRole('button', { name: /enter wedding site/i });
    enterBtn.click();
    // Wait for main site to load
    await screen.findByRole('main', {}, { timeout: 2000 });
    // Main ARIA landmarks
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByLabelText(/main content/i)).toBeInTheDocument();
  });

  it('should provide alternative text for all images', async () => {
    render(<PhotoGallery refreshKey={0} />);
    // All images should have alt text
    const imgs = screen.queryAllByRole('img');
    imgs.forEach((img) => {
      expect(img).toHaveAttribute('alt');
      expect(img.alt.length).toBeGreaterThan(0);
    });
  });

  it('should support keyboard-only navigation after entering site', async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // Wait for landing page to load
    await screen.findByText(/thank you/i, {}, { timeout: 2000 });
    // Simulate entering the site (click enter button)
    const enterBtn = screen.getByRole('button', { name: /enter wedding site/i });
    enterBtn.click();
    // Wait for skip link to appear
    const skipLink = await screen.findByText(/skip to main content/i, {}, { timeout: 2000 });
    skipLink.focus();
    expect(document.activeElement).toBe(skipLink);
  });
});
