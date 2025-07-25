import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AlbumPage from '../../page-components/AlbumPage.jsx';

import * as api from '../../services/api.js';

jest.spyOn(api, 'getAlbumMedia').mockResolvedValue({ data: [] });

describe('AlbumPage Empty State', () => {
  it('shows empty state when no media is available', async () => {
    render(<AlbumPage />);
    await waitFor(() =>
      expect(screen.getByText(/No media yet. Be the first to upload!/i)).toBeInTheDocument()
    );
  });
});
