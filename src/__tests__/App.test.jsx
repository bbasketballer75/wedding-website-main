import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import App from '../App.jsx';

// Mock all the service calls
vi.mock('../services/api.js', () => ({
  logVisit: vi.fn().mockResolvedValue({}),
  getAlbumMedia: vi.fn(() => Promise.resolve({ data: [] })),
}));

// Mock HTMLAudioElement
window.HTMLAudioElement.prototype.play = vi.fn();
window.HTMLAudioElement.prototype.pause = vi.fn();
window.HTMLAudioElement.prototype.load = vi.fn();

// Mock URL.createObjectURL
window.URL.createObjectURL = vi.fn(() => 'mock-url');

describe('App', () => {
  test('renders orientation overlay first when needed', () => {
    // Mock portrait orientation
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(orientation: portrait)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Should show orientation overlay
    expect(screen.getByText('Please Rotate Your Device')).toBeInTheDocument();
  });

  test('shows landing page after loading', async () => {
    // Mock landscape orientation
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query !== '(orientation: portrait)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Wait for loading to finish and landing page to appear
    await screen.findByText('Austin & Jordyn', {}, { timeout: 2000 });
    expect(screen.getByText('Our Wedding Celebration')).toBeInTheDocument();
  });

  test('shows main site after entering from landing page', async () => {
    // Mock landscape orientation
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query !== '(orientation: portrait)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    );

    // Wait for landing page
    const enterButton = await screen.findByRole(
      'button',
      { name: /enter wedding site with music and video/i },
      { timeout: 2000 }
    );

    // Click enter
    fireEvent.click(enterButton);

    // Should show notification and main content
    expect(
      await screen.findByText(
        'Welcome! Enjoy the music and explore the memories.',
        {},
        { timeout: 2000 }
      )
    ).toBeInTheDocument();
    expect(await screen.findByText('Thank You', {}, { timeout: 2000 })).toBeInTheDocument();
  });
});
