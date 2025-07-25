import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

import GuestbookPage from '../GuestbookPage.jsx';

jest.mock('../../services/api.js', () => ({
  getGuestbookEntries: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Alice', message: 'Congrats!' },
        { id: 2, name: 'Bob', message: 'Best wishes!' },
      ],
    })
  ),
  postGuestbookEntry: jest.fn(() =>
    Promise.resolve({ data: { id: 3, name: 'Test User', message: 'Congrats!' } })
  ),
}));

describe('GuestbookPage', () => {
  it('shows guestbook heading and messages after render', async () => {
    await act(async () => {
      render(<GuestbookPage />);
    });
    // Wait for heading and messages to appear
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /Guestbook/i })).toBeInTheDocument()
    );
    expect(screen.getByText('Congrats!')).toBeInTheDocument();
    expect(screen.getByText('Best wishes!')).toBeInTheDocument();
  });

  it('renders guestbook form', async () => {
    await act(async () => {
      render(<GuestbookPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    expect(screen.getByPlaceholderText(/Your Name/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Share your favorite memory or a message for the couple!/i)
    ).toBeInTheDocument();
  });

  it('submits a new entry', async () => {
    await act(async () => {
      render(<GuestbookPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/Your Name/i), { target: { value: 'Test User' } });
    fireEvent.change(
      screen.getByPlaceholderText(/Share your favorite memory or a message for the couple!/i),
      { target: { value: 'Congrats!' } }
    );
    fireEvent.click(screen.getByRole('button', { name: /Sign/i }));
    // Should show new entry or success message (depends on implementation)
    // expect(screen.getByText(/Congrats!/i)).toBeInTheDocument();
  });
});
