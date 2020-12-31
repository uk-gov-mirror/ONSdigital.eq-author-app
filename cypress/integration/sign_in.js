const { describe } = require("mocha");

describe("Signing in to Author", () => {
  const emailInputSelector = "input[type='email'][name='email']";
  const submitButtonSelector = "button[type='submit']";
  const nameInputSelector = "input[type='text'][name='name']";
  const newPasswordInputSelector = "input[type='password'][name='newPassword']";
  const existingPasswordInputSelector =
    "input[type='password'][name='password']";

  beforeEach(() => {
    cy.visit("/sign-in");
  });

  context("With a new account", () => {
    const mockEmail = "cypress_unregistered@ons.gov.uk";
    it("Should prompt me to create an account when it does not recognise my email address", () => {
      cy.get(emailInputSelector).type(mockEmail);
      cy.get(submitButtonSelector).click();

      cy.get(emailInputSelector)
        .invoke("val")
        .should("eq", mockEmail);

      cy.get(nameInputSelector).should("be.visible");
      cy.get(newPasswordInputSelector).should("be.visible");
    });
  });

  context("With an existing account", () => {
    const mockEmail = Cypress.env("CYPRESS_EMAIL");
    const mockPassword = Cypress.env("CYPRESS_PASSWORD");

    it("Should prompt me to enter my password if it recognises my email address", () => {
      cy.get(emailInputSelector).type(mockEmail);
      cy.get(submitButtonSelector).click();

      cy.get(emailInputSelector)
        .invoke("val")
        .should("eq", mockEmail);

      cy.get(existingPasswordInputSelector).should("be.visible");
    });

    it("Should allow me to sign in", () => {
      cy.get(emailInputSelector).type(mockEmail);
      cy.get(submitButtonSelector).click();
      cy.get(existingPasswordInputSelector).type(mockPassword);
      cy.get(submitButtonSelector).click();
      cy.get("h1").should("contain", "Questionnaires");

      //Test cleanup
      cy.get("button.UserProfile__LogoutButton-sc-18gmau8-2").click();
    });
  });
});
