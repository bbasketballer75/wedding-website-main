import React from 'react';
import { render, screen } from '@testing-library/react';

import Home from '../app/page';

// Mock web-vitals library
vi.mock('web-vitals', () => ({
  getCLS: vi.fn((callback) =>
    callback({ name: 'CLS', value: 0.1, id: 'test', delta: 0, entries: [] })
  ),
  getFID: vi.fn((callback) =>
    callback({ name: 'FID', value: 50, id: 'test', delta: 0, entries: [] })
  ),
  getFCP: vi.fn((callback) =>
    callback({ name: 'FCP', value: 1500, id: 'test', delta: 0, entries: [] })
  ),
  getLCP: vi.fn((callback) =>
    callback({ name: 'LCP', value: 2000, id: 'test', delta: 0, entries: [] })
  ),
  getTTFB: vi.fn((callback) =>
    callback({ name: 'TTFB', value: 500, id: 'test', delta: 0, entries: [] })
  ),
}));

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

// Mock Next.js dynamic imports to return simple components
vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: (fn) => {
    const MockComponent = () =>
      React.createElement('div', { 'data-testid': 'mock-component' }, 'Loading...');
    MockComponent.displayName = 'MockedDynamicComponent';
    return MockComponent;
  },
}));

describe('App (Next.js Home Page)', () => {
  test('renders main app structure', () => {
    render(<Home />);

    // Should have skip link
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();

    // Should have loading state or app container
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders app container with proper class', () => {
    render(<Home />);

    // Should have app container
    const appContainer = document.querySelector('.App');
    expect(appContainer).toBeInTheDocument();
  });

  test('contains proper accessibility structure', () => {
    render(<Home />);

    // Should have skip link with proper href
    const skipLink = screen.getByText('Skip to main content');
    expect(skipLink).toHaveAttribute('href', '#main-content');

    // Should have loading status for screen readers
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
