Cypress.Commands.add('populateForm', () => {
    cy.get('@year').click()
    cy.get('ul li').first().click()
    cy.get('@quarter').click()
    cy.get('ul li').first().click()
    cy.get('@description').type("description")
})