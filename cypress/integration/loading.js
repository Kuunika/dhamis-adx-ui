/// <reference types="cypress" />
describe("DHAMIS ui", () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.get('#select-year').as('year')
    cy.get('#select-quarter').as('quarter')
    cy.get('#description').as('description')

  })

  it("renders Form inputs", () => {
    cy.get('@year').should('be.visible')
    cy.get('@quarter').should('be.visible')
    cy.get('@description').should('be.visible')
  });

  it("inputs should contain value after data input", () => {
    const description = 'description'
    cy.get('@year').click()
    cy.get('ul li').first().click()
    cy.get('#year').should('have.value', 2000)
    cy.get('@quarter').click()
    cy.get('ul li').first().click()
    cy.get('#quarter').should('have.value', 1)
    cy.get('@description').type(description).should('have.value', description)
  });


});
