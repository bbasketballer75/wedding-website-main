import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import AlbumPage from '../AlbumPage.jsx';

expect.extend(toHaveNoViolations);

describe('AlbumPage accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(
      <MemoryRouter>
        <AlbumPage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
