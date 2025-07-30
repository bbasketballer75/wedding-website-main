import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App.jsx';

expect.extend(toHaveNoViolations);

describe('App accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
