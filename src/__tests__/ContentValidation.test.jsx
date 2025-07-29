// Content Validation Test

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import GuestbookPage from '../page-components/GuestbookPage.jsx';
import * as api from '../services/api.js';

describe('Guest Content Experience', () => {
  it('should sanitize and validate guestbook entries', async () => {
    vi.spyOn(api, 'createGuestbookEntry').mockResolvedValue({});
    vi.spyOn(api, 'getGuestbookEntries').mockResolvedValue({ data: [] });
    render(<GuestbookPage />);
    await screen.findByPlaceholderText('Your name');
    fireEvent.change(screen.getByPlaceholderText('Your name'), { target: { value: 'Evil User' } });
    const textarea = screen.getByPlaceholderText(
      'Share your favorite memory or a message for the couple!'
    );
    fireEvent.change(textarea, {
      target: { value: '<img src=x onerror=alert(1) /> <script>alert(1)</script>' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign|post|submit/i }));
    await waitFor(() => expect(screen.getByText(/thank you for signing/i)).toBeInTheDocument());
    // Should not render script tag in the DOM
    expect(document.querySelector('script')).toBeNull();
  });
});
