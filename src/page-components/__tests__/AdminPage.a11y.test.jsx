import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from '../AdminPage.jsx';

expect.extend(toHaveNoViolations);

describe('AdminPage accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
