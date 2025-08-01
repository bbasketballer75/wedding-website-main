import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import GuestbookPage from '../GuestbookPage.jsx';
import * as api from '../../services/api.js';

vi.spyOn(api, 'getGuestbookEntries').mockResolvedValue({ data: [] });
vi.spyOn(api, 'createGuestbookEntry').mockImplementation(({ message }) => {
  if (!message.trim()) {
    return Promise.reject(new Error('Message is required.'));
  }
  return Promise.resolve({});
});

describe('GuestbookPage Error States', () => {
  it('shows error for empty message submission', async () => {
    render(<GuestbookPage />);
    await screen.findByPlaceholderText('Your name');
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Test User' } });
    const textarea = screen.getByPlaceholderText(
      'Share a favorite memory, marriage advice, or just say hello!'
    );
    fireEvent.change(textarea, { target: { value: '' } });
    // eslint-disable-next-line no-console
    // ...existing code...
    const form = document.querySelector('form');
    await act(async () => {
      fireEvent.submit(form);
    });
    // eslint-disable-next-line no-console
    // ...existing code...
    await waitFor(() => {
      expect(screen.getByText(/Message is required/i)).toBeInTheDocument();
    });
  });
});
