import React from 'react';

import { render, screen, act } from '@testing-library/react';
import AdminDashboard from '../admin/AdminDashboard.jsx';

// Mock the api service
vi.mock('../../../services/api.js', () => ({
  getAllAlbumMedia: vi.fn(
    () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
  ),
  moderateMedia: vi.fn(),
}));

describe('AdminDashboard', () => {
  it('renders loading state initially', async () => {
    await act(async () => {
      render(<AdminDashboard adminKey="test-key" />);
    });
    expect(screen.getByText('Loading submissions...')).toBeInTheDocument();
  });
});
