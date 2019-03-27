import { kebabCase } from "lodash";

import {
  addAnswerType,
  addQuestionnaire,
  findByLabel,
  removeAnswer,
  testId,
} from "../../utils";

import {
  TEXTFIELD,
  NUMBER,
  CURRENCY,
  TEXTAREA,
  DATE,
  PERCENTAGE,
} from "../../../src/constants/answer-types";

const questionnaireTitle = "Answer Properties Question Test";
describe("Answer Properties", () => {
  before(() => {
    cy.visit("/");
    cy.login();
    addQuestionnaire(questionnaireTitle);
  });

  beforeEach(() => {
    cy.login();
  });

  describe("Title", () => {
    it("Should show answer type as uppercase text", () => {
      [TEXTFIELD, NUMBER, CURRENCY, TEXTAREA].forEach(answerType => {
        addAnswerType(answerType);
        cy.get(testId(`accordion-${answerType.toLowerCase()}-button`)).contains(
          answerType.toUpperCase()
        );
        removeAnswer({ multiple: false });
      });
    });
    it("Should show numbered answer types", () => {
      const answerTypeTitles = [
        {
          type: NUMBER,
          title: "NUMBER",
        },
        {
          type: NUMBER,
          title: "NUMBER 2",
        },
        {
          type: TEXTFIELD,
          title: "TEXTFIELD",
        },
        {
          type: NUMBER,
          title: "NUMBER 3",
        },
        {
          type: TEXTFIELD,
          title: "TEXTFIELD",
        },
      ];

      answerTypeTitles.forEach(({ title, type }) => {
        addAnswerType(type);
        cy.get(testId(`accordion-${kebabCase(title)}-button`)).contains(title);
      });
      cy.get(testId("btn-delete-answer")).should("have.length", 5);
      removeAnswer({ multiple: true });
      cy.get(testId("btn-delete-answer")).should("have.length", 0);
    });
  });
  describe("Answer Type", () => {
    describe("Text", () => {
      beforeEach(() => {
        addAnswerType(TEXTFIELD);
        cy.get(testId("txt-answer-label")).type("Hello World");
      });
      describe("Required", () => {
        const labelText = "Required";
        it("Should default to off", () => {
          findByLabel(labelText).should("not.be.checked");
        });
        it("Can toggle 'Required' property on and off", () => {
          findByLabel(labelText)
            .click({ force: true })
            .should("be.checked");
          findByLabel(labelText)
            .click({ force: true })
            .should("not.be.checked");
        });
      });
      afterEach(() => {
        removeAnswer();
      });
    });
    [NUMBER, CURRENCY, PERCENTAGE].forEach(type => {
      describe(type, () => {
        beforeEach(() => {
          addAnswerType(type);
          cy.get(testId("txt-answer-label")).type("Hello World");
        });
        describe("Required", () => {
          const labelText = "Required";
          it("Should default to off", () => {
            findByLabel(labelText).should("not.be.checked");
          });
          it("Can toggle 'Required' property on and off", () => {
            findByLabel(labelText)
              .click({ force: true })
              .should("be.checked");
            findByLabel(labelText)
              .click({ force: true })
              .should("not.be.checked");
          });
        });
        describe("Decimals", () => {
          const labelText = "Decimals";
          it("Should default to 0", () => {
            findByLabel(labelText).should("have.value", "0");
          });
          it("Can change value", () => {
            findByLabel(labelText)
              .type("{backspace}3")
              .blur()
              .should("have.value", "3");
          });
        });
        afterEach(() => {
          removeAnswer();
        });
      });
    });

    describe("Date", () => {
      beforeEach(() => {
        addAnswerType(DATE);
        cy.get(testId("date-answer-label")).type("Hello World");
      });
      describe("Required", () => {
        const labelText = "Required";
        it("Should default to off", () => {
          findByLabel(labelText).should("not.be.checked");
        });
        it("Can toggle 'Required' property on and off", () => {
          findByLabel(labelText)
            .click({ force: true })
            .should("be.checked");
          findByLabel(labelText)
            .click({ force: true })
            .should("not.be.checked");
        });
      });
      describe("Date format", () => {
        const labelText = "Date type";
        it("Should show 'Date type' label", () => {
          findByLabel(labelText);
        });
        it("Should default to dd/mm/yyyy", () => {
          cy.get("select").should("have.value", "dd/mm/yyyy");
        });
        it("Can change value", () => {
          cy.get("select")
            .select("yyyy")
            .should("have.value", "yyyy");
        });
        it("Should update date formatter", () => {
          cy.get("select")
            .select("yyyy")
            .should("have.value", "yyyy");
          cy.get(testId("dummy-date")).within(() => {
            cy.get(testId("dummy-date-day")).should("not.exist");
            cy.get(testId("dummy-date-month")).should("not.exist");
            cy.get(testId("dummy-date-year")).should("exist");
          });
          cy.get("select")
            .select("mm/yyyy")
            .should("have.value", "mm/yyyy");
          cy.get(testId("dummy-date")).within(() => {
            cy.get(testId("dummy-date-day")).should("not.exist");
            cy.get(testId("dummy-date-month")).should("exist");
            cy.get(testId("dummy-date-year")).should("exist");
          });
          cy.get("select")
            .select("dd/mm/yyyy")
            .should("have.value", "dd/mm/yyyy");
          cy.get(testId("dummy-date")).within(() => {
            cy.get(testId("dummy-date-day")).should("exist");
            cy.get(testId("dummy-date-month")).should("exist");
            cy.get(testId("dummy-date-year")).should("exist");
          });
        });
      });
      afterEach(() => {
        removeAnswer();
      });
    });
  });

  after(() => {
    cy.deleteQuestionnaire(questionnaireTitle);
  });
});
