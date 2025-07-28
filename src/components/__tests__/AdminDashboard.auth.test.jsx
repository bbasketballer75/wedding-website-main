import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard.jsx';
import * as api from '../../services/api.js';

describe('AdminDashboard Unauthorized Access', () => {
  beforeAll(() => {
    vi.spyOn(api, 'getAllAlbumMedia').mockRejectedValue({
      response: { data: { message: 'Could not fetch media. Is the admin key correct?' } },
    });
  });

  it('shows error if adminKey is missing or invalid', async () => {
    await act(async () => {
      render(<AdminDashboard adminKey={null} />);
    });
    expect(await screen.findByRole('alert')).toHaveTextContent(
      /Could not fetch media. Is the admin key correct?/i
    );
  });
});
