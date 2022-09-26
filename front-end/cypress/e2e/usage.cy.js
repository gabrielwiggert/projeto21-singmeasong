describe('Tests routes', () => {
  it('Tests clicking on top tab', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#top').click();

    cy.url().should('equal', 'http://localhost:3000/top');
  });

  it('Tests clicking on random tab', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#random').click();

    cy.url().should('equal', 'http://localhost:3000/random');
  });
});