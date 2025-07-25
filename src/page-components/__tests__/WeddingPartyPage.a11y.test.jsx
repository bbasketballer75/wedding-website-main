import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import WeddingPartyPage from '../WeddingPartyPage.jsx';

expect.extend(toHaveNoViolations);

describe('WeddingPartyPage accessibility', () => {
  it('should have no accessibility violations on load', async () => {
    const { container } = render(
      <MemoryRouter>
        <WeddingPartyPage />
      </MemoryRouter>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
