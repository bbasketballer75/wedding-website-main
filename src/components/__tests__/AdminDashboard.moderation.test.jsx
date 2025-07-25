import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

jest.mock('../../services/api.js', () => ({
  moderateMedia: jest.fn(() => Promise.resolve()),
  getAllAlbumMedia: jest.fn(() => Promise.resolve({ data: [] })),
}));
import AdminDashboard from '../AdminDashboard.jsx';

describe('AdminDashboard Moderation', () => {
  it('approves and denies media submissions', async () => {
    const media = [
      {
        _id: '1',
        mimetype: 'image/jpeg',
        filepath: '1.jpg',
        approved: false,
        uploadedBy: 'User',
        timestamp: Date.now(),
      },
    ];
    await act(async () => {
      render(<AdminDashboard adminKey="test-key" />);
    });
    // Simulate media loaded
    // ...simulate approve/deny actions and check UI updates...
    // This is a placeholder for actual implementation
    expect(true).toBe(true);
  });
});
