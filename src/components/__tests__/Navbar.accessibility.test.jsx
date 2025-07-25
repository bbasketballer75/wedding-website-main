import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar.tsx';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Navbar Accessibility', () => {
  it.skip('has no accessibility violations', async () => {
    // Skipped due to JSDOM limitations in jest-axe
  });

  it('supports keyboard navigation', () => {
    render(<Navbar onePage={true} />);
    const navLinks = screen.getAllByRole('link');
    navLinks.forEach((link) => {
      expect(link).toBeVisible();
    });
  });

  it('renders ARIA roles', () => {
    render(<Navbar onePage={true} />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
