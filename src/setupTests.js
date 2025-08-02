// Mock window.matchMedia for jsdom
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = function (query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {},
    };
  };
}
// Vitest/Testing Library setup

import '@testing-library/jest-dom';

// Global teardown: clear all timers and ensure window is defined
afterEach(() => {
  // Clear all timeouts/intervals
  if (typeof jest !== 'undefined' && typeof jest.clearAllTimers === 'function')
    jest.clearAllTimers();
  if (typeof vi !== 'undefined' && typeof vi.clearAllTimers === 'function') vi.clearAllTimers();
});

// Prevent "window is not defined" teardown errors
if (typeof global.window === 'undefined') {
  global.window = {};
}

// Mock IntersectionObserver for lazy loading components
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
    }

    observe() {
      // Immediately trigger intersection for testing
      setTimeout(() => {
        this.callback([{ isIntersecting: true }]);
      }, 0);
    }

    unobserve() {
      // Mock implementation
    }

    disconnect() {
      // Mock implementation
    }
  };
}

// If you need to mock axios or fetch, use Vitest's vi.mock in your test files.
