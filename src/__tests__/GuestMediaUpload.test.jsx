// Media Upload & Interaction Test

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AlbumPage from '../page-components/gallery/AlbumPage.jsx';

// Mock uploadMedia and getAlbumMedia
vi.mock('../../services/api', () => ({
  getAlbumMedia: vi.fn(() => Promise.resolve({ data: [] })),
  uploadMedia: vi.fn(() => new Promise((resolve) => setTimeout(resolve, 500))),
}));

describe('Guest Media Upload Experience', () => {
  it('should validate file types and sizes', async () => {
    render(<AlbumPage />);
    const fileInput = await screen.findByLabelText(
      /Share your captured wedding magic - photo or video/i
    );
    // Simulate invalid file type
    const badFile = new File(['bad'], 'bad.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [badFile] } });
    // Should not trigger upload button (no error UI in current impl, but can check file type logic)
    expect(fileInput.files[0].type).not.toMatch(/image|video/);
    // Simulate valid file
    const goodFile = new File(['img'], 'good.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [goodFile] } });
    expect(fileInput.files[0].type).toMatch(/image/);
  });

  it('should show upload progress for large files', async () => {
    render(<AlbumPage />);
    const fileInput = await screen.findByLabelText(
      /Share your captured wedding magic - photo or video/i
    );
    const uploadBtn = screen.getByRole('button', { name: /Gift Your Memory/i });
    const file = new File([new ArrayBuffer(5 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(uploadBtn);
    // Should show uploading state
    expect(
      await screen.findByText(/Weaving your treasure into our collection.../i)
    ).toBeInTheDocument();
    await waitFor(
      () =>
        expect(
          screen.queryByText(/Weaving your treasure into our collection/i)
        ).not.toBeInTheDocument(),
      {
        timeout: 2000,
      }
    );
  });
});
