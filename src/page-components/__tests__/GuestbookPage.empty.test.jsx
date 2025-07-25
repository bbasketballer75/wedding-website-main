import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import GuestbookPage from '../GuestbookPage.jsx';

describe('GuestbookPage Empty State', () => {
  it('shows empty state when no entries are available', async () => {
    render(<GuestbookPage />);
    await waitFor(() =>
      expect(
        screen.getByText(/No messages yet. Be the first to share a memory!/i)
      ).toBeInTheDocument()
    );
  });
});
