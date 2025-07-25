import React from 'react';

import { render, screen, act } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard.jsx';

// Mock the api service
jest.mock('../../services/api.js', () => ({
  getAllAlbumMedia: jest.fn(
    () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
  ),
  moderateMedia: jest.fn(),
}));

describe('AdminDashboard', () => {
  it('renders loading state initially', async () => {
    await act(async () => {
      render(<AdminDashboard adminKey="test-key" />);
    });
    expect(screen.getByText('Loading submissions...')).toBeInTheDocument();
  });
});
