import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AlbumPage from '../../page-components/AlbumPage.jsx';

import * as api from '../../services/api.js';

vi.spyOn(api, 'getAlbumMedia').mockResolvedValue({ data: [] });

describe('AlbumPage Empty State', () => {
  it('shows empty state when no media is available', async () => {
    render(<AlbumPage />);
    await waitFor(() =>
      expect(
        screen.getByText(/This collection is just waiting for your beautiful memories!/i)
      ).toBeInTheDocument()
    );
  });
});
