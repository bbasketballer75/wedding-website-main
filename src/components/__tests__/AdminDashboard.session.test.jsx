import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard.jsx';

describe('AdminDashboard Session', () => {
  it('persists admin session after refresh', async () => {
    sessionStorage.setItem('adminKey', 'test-key');
    await act(async () => {
      render(<AdminDashboard adminKey={sessionStorage.getItem('adminKey')} />);
    });
    expect(await screen.findByLabelText('Admin moderation dashboard')).toBeInTheDocument();
  });
});
import * as api from '../../services/api.js';
jest.spyOn(api, 'getAllAlbumMedia').mockResolvedValue({ data: [] });
