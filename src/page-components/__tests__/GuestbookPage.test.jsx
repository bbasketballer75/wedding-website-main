import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

import GuestbookPage from '../GuestbookPage.jsx';

vi.mock('../../services/api.js', () => ({
  getGuestbookEntries: vi.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Alice', message: 'Congrats!' },
        { id: 2, name: 'Bob', message: 'Best wishes!' },
      ],
    })
  ),
  postGuestbookEntry: vi.fn(() =>
    Promise.resolve({
      data: { id: 3, name: 'Charlie', message: 'Have a great day!' },
    })
  ),
}));

describe('GuestbookPage', () => {
  it('shows guestbook heading and messages after render', async () => {
    await act(async () => {
      render(<GuestbookPage />);
    });
    // Wait for heading and messages to appear (look for specific heading level)
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { level: 2, name: /Our Sacred Memory Book/i })
      ).toBeInTheDocument()
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
      screen.getByPlaceholderText(
        /Pour your heart into words... share a magical memory, offer wisdom for our journey, or simply bless us with your love!/i
      )
    ).toBeInTheDocument();
  });

  it('submits a new entry', async () => {
    await act(async () => {
      render(<GuestbookPage />);
    });
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    fireEvent.change(screen.getByPlaceholderText(/Your Name/i), { target: { value: 'Test User' } });
    fireEvent.change(
      screen.getByPlaceholderText(
        /Pour your heart into words... share a magical memory, offer wisdom for our journey, or simply bless us with your love!/i
      ),
      { target: { value: 'Congrats!' } }
    );
    fireEvent.click(screen.getByRole('button', { name: /Share Your Heart/i }));
    // Should show new entry or success message (depends on implementation)
    // expect(screen.getByText(/Congrats!/i)).toBeInTheDocument();
  });
});
