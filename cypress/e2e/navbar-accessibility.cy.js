/// <reference types="cypress" />
import 'cypress-axe';

describe('Navbar accessibility', () => {
  beforeEach(() => {
    cy.visit('/'); // Adjust if your Navbar is on a different route
    cy.injectAxe();
  });

  it('has no detectable accessibility violations', () => {
    cy.checkA11y();
  });
});
