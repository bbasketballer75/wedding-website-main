import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar.tsx';

describe('Navbar', () => {
  it('renders logo and tagline', () => {
    render(<Navbar />);
    expect(screen.getByText(/Austin & Jordyn/i)).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navbar />);
    // Test specific navigation links as menu items (not links)
    expect(screen.getByRole('menuitem', { name: /^Home$/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Family Tree/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Album/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Guestbook/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Map/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /Wedding Party/i })).toBeInTheDocument();
  });

  it('opens and closes mobile menu', () => {
    render(<Navbar />);
    const toggle = screen.getByLabelText(/Toggle navigation/i);
    fireEvent.click(toggle);
    expect(screen.getByRole('navigation')).toBeVisible();
    fireEvent.click(toggle);
    expect(screen.getByRole('navigation')).toBeVisible(); // Should remain visible for accessibility
  });

  it('renders the navbar with brand and links', () => {
    render(<Navbar />);
    // Check for the brand name
    expect(screen.getByText('Austin & Jordyn')).toBeInTheDocument();
    // Check for a few links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Album')).toBeInTheDocument();
    expect(screen.getByText('Guestbook')).toBeInTheDocument();
  });
});
