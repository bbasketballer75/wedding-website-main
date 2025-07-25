import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingScreen from '../LoadingScreen.jsx';

describe('LoadingScreen', () => {
  it('renders loading message', () => {
    render(<LoadingScreen />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
