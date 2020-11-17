/// <reference types="cypress" />

describe("App suit", () => {
  it("Visits the Kitchen Sink", async () => {
    await cy.visit("http://localhost:3001/");
    await cy.get("#description").type("Description");
    await cy.get("#migrate").click();
    await cy.get("#year").type(2000);
  });
});
