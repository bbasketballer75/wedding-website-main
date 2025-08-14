import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

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
  createGuestbookEntry: vi.fn(() =>
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

  it('renders guestbook components', async () => {
    render(<GuestbookPage />);

    // Wait for component to be ready
    await waitFor(() => {
      expect(screen.getByText('Our Sacred Memory Book')).toBeInTheDocument();
    });

    expect(screen.getByText('Our Sacred Memory Book')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Your precious words become golden threads in the tapestry of our love story/i
      )
    ).toBeInTheDocument();

    // Verify photo upload section is integrated
    expect(screen.getByText('Share Your Wedding Memories')).toBeInTheDocument();
    expect(screen.getByText(/Help us preserve the magic of May 10th, 2025/i)).toBeInTheDocument();
  });

  it('submits a new entry', async () => {
    const { createGuestbookEntry } = await import('../../services/api.js');

    render(<GuestbookPage />);
    await waitFor(() => {
      expect(screen.getByText('Our Sacred Memory Book')).toBeInTheDocument();
    });

    // Use label text to target guestbook form specifically
    fireEvent.change(screen.getByLabelText(/Name \(optional\)/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/Message \*/i), { target: { value: 'Test message' } });

    fireEvent.click(screen.getByRole('button', { name: /Share Your Heart & Soul/i }));

    await waitFor(() => {
      expect(createGuestbookEntry).toHaveBeenCalledWith({
        name: 'Test User',
        message: 'Test message',
      });
    });

    // Verify photo upload section remains present after submission
    expect(screen.getByText(/Help us preserve the magic of May 10th, 2025/i)).toBeInTheDocument();
  });
});
