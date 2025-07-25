import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import HomePage from '../HomePage.jsx';

expect.extend(toHaveNoViolations);

describe('HomePage accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  }, 30000); // Increased timeout to 30 seconds for accessibility testing
});
