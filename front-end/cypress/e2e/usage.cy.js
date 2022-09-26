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

describe('Tests submitting a recommendation + further actions', () => {
  it('Tests submitting a recommendation', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#Name').type("Test");
    cy.get('#https').type("https://www.youtube.com/watch?v=75Mw8r5gW8E");

    cy.get('.btn').click();
  });

  it('Tests submitting a recommendation and clicking on the video', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#Name').type("Test");
    cy.get('#https').type("https://www.youtube.com/watch?v=75Mw8r5gW8E");

    cy.intercept('POST', 'http://localhost:5000/recommendations').as('post');

    cy.get('.btn').click();

    cy.wait('@post');

    cy.get('[id=video]').click();
  });

  it('Tests submitting a recommendation and upvoting it', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#Name').type("Test");
    cy.get('#https').type("https://www.youtube.com/watch?v=75Mw8r5gW8E");

    cy.intercept('POST', 'http://localhost:5000/recommendations').as('post');

    cy.get('.btn').click();

    cy.wait('@post');

    cy.get('[id=up]').click();
  });

  it('Tests submitting a recommendation and downvoting it', () => {
    cy.visit('http://localhost:3000/');

    cy.get('#Name').type("Test");
    cy.get('#https').type("https://www.youtube.com/watch?v=75Mw8r5gW8E");

    cy.intercept('POST', 'http://localhost:5000/recommendations').as('post');

    cy.get('.btn').click();

    cy.wait('@post');

    cy.get('[id=down]').click();
  });
});