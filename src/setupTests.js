// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toBeInTheDocument();
import '@testing-library/jest-dom';
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })), // Return empty array for guestbook entries
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  // Add other methods as needed
}));
// Optionally, mock fetch globally if used
// global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({}) }));
