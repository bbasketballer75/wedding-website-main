import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { uploadMedia } from '../../services/api';
import UploadForm from '../forms/UploadForm.jsx';

describe('UploadForm', () => {
  it('renders upload form fields', () => {
    render(<UploadForm />);
    // The input uses aria-label and placeholder, not a visible label
    expect(screen.getByLabelText(/Select image or video to upload/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload File/i })).toBeInTheDocument();
  });
});
vi.mock('../../../services/api.js');

describe('UploadForm', () => {
  beforeEach(() => {
    vi.mocked(uploadMedia).mockReset();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the upload form', () => {
    render(<UploadForm />);
    expect(screen.getByText('Contribute to Our Album')).toBeInTheDocument();
    expect(
      screen.getByText('Share your favorite moments from our special day!')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload file/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Select image or video to upload')).toBeInTheDocument();
  });

  it('shows error if no file is selected on submit', async () => {
    render(<UploadForm />);
    fireEvent.click(screen.getByRole('button', { name: /upload file/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Please select a file first.');
  });

  it('shows error for invalid file type', async () => {
    render(<UploadForm />);
    const fileInput = screen.getByLabelText('Select image or video to upload');
    const file = new File(['dummy'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid file type');
  });

  it('shows error for file too large', async () => {
    render(<UploadForm />);
    const fileInput = screen.getByLabelText('Select image or video to upload');
    // Create a smaller mock file to speed up the test
    const file = new File(['test'], 'big.mp4', { type: 'video/mp4' });
    Object.defineProperty(file, 'size', { value: 101 * 1024 * 1024 });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(await screen.findByRole('alert')).toHaveTextContent('File is too large');
  }, 15000);

  it('calls uploadMedia and shows success on valid upload', async () => {
    vi.mocked(uploadMedia).mockResolvedValueOnce();
    render(<UploadForm />);
    const fileInput = screen.getByLabelText('Select image or video to upload');
    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload file/i }));
    await waitFor(() => {
      expect(vi.mocked(uploadMedia)).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('status')).toHaveTextContent(
        'Thank you! Your file has been uploaded'
      );
    });
  });

  it('shows error if uploadMedia throws', async () => {
    vi.mocked(uploadMedia).mockRejectedValueOnce({
      response: { data: { message: 'Server error' } },
    });
    render(<UploadForm />);
    const fileInput = screen.getByLabelText('Select image or video to upload');
    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload file/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Server error');
  });

  it('disables input and button while uploading', async () => {
    let resolveUpload;
    vi.mocked(uploadMedia).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpload = resolve;
        })
    );
    render(<UploadForm />);
    const fileInput = screen.getByLabelText('Select image or video to upload');
    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload file/i }));
    expect(fileInput).toBeDisabled();
    expect(screen.getByRole('button', { name: /uploading/i })).toBeDisabled();
    resolveUpload();
    await waitFor(() => {
      expect(fileInput).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /upload file/i })).not.toBeDisabled();
    });
  });

  it('calls onUploadSuccess callback after successful upload', async () => {
    vi.mocked(uploadMedia).mockResolvedValueOnce();
    const onUploadSuccess = vi.fn();
    render(<UploadForm onUploadSuccess={onUploadSuccess} />);
    const fileInput = screen.getByLabelText('Select image or video to upload');
    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /upload file/i }));
    await waitFor(() => {
      expect(onUploadSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('has proper accessibility attributes', () => {
    render(<UploadForm />);
    const fileInput = screen.getByLabelText('Select image or video to upload');
    expect(fileInput).toHaveAttribute('aria-required', 'true');
    expect(fileInput).toHaveAttribute('aria-label', 'Select image or video to upload');
    // Form role is implicit, so just check the form exists
    expect(
      screen.getByRole('form', { hidden: true }) || screen.getByRole('form')
    ).toBeInTheDocument();
  });
});
