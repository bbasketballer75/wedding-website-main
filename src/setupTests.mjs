// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toBeInTheDocument();
import '@testing-library/jest-dom';
import jest from 'jest-mock';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })), // Return empty array for guestbook entries
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  // Add other methods as needed
}));
// Optionally, mock fetch globally if used
// global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));

// Global teardown: clear all timers and ensure window is defined
afterEach(() => {
  if (typeof jest !== 'undefined' && typeof jest.clearAllTimers === 'function')
    jest.clearAllTimers();
  if (typeof vi !== 'undefined' && typeof vi.clearAllTimers === 'function') vi.clearAllTimers();
});

if (typeof global.window === 'undefined') {
  global.window = {};
}
