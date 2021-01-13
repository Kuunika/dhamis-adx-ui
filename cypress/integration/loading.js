/// <reference types="cypress" />
describe("DHAMIS ui", () => {
  beforeEach(() => {
    cy.visit('/')
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
    cy.populateForm()

    cy.get('#year').should('have.value', 2000)

    cy.get('#quarter').should('have.value', 1)
    cy.get('@description').should('have.value', description)
  });

  context('Submit Form', () => {
    beforeEach(() => {
      cy.server();
      cy.populateForm()
    })

    it('shows error dialog if dhamis endpoint returns error', () => {
      cy.route({ method: 'GET', url: '/dhumis/dataset/get/secret/2/2', status: 404 })
      cy.get('button[data-test=submit]').click()
      cy.get('div[role=dialog]').should('be.visible')

    })
    it('shows error dialog if IL endpoint returns error', () => {
      cy.route('GET', '/dhumis/dataset/get/secret/2/2', 'fixture:dhamis-response')
      cy.get('button[data-test=submit]').click()
      cy.get('div[role=dialog]').should('be.visible')

    })

    it('shows success dialog if IL endpoint return successfully', () => {
      cy.route('GET', '/dhumis/dataset/get/secret/2/2', 'fixture:dhamis-response')
      cy.route({
        method: 'POST',
        url: '/IL/dhis2/data-elements',
        status: 202,
        response: 'fixture:IL-response'
      })
      cy.get('button[data-test=submit]').click()
      cy.get('div[role=dialog]').should('be.visible')

    })


  })




});
