import React from "react";
import { render, fireEvent, act, flushPromises } from "tests/utils/rtl";
import { MeContext } from "App/MeContext";
import { UnwrappedQCodeTable } from "./index";
import UPDATE_ANSWER_QCODE from "./updateAnswerMutation.graphql";
import UPDATE_OPTION_QCODE from "./updateOptionMutation.graphql";
import UPDATE_CONFIRMATION_QCODE from "./updateConfirmationQCode.graphql";
import UPDATE_CALCSUM_QCODE from "./updateCalculatedSummary.graphql";
import QuestionnaireContext from "components/QuestionnaireContext";

import {
  UNIT,
  DURATION,
  PERCENTAGE,
  CURRENCY,
  TEXTFIELD,
  TEXTAREA,
  RADIO,
  DATE_RANGE,
  DATE,
  CHECKBOX,
  NUMBER,
} from "constants/answer-types";

describe("Qcode Table", () => {
  let user, questionnaire, mocks, queryWasCalled, props, questionnaireId;

  beforeEach(() => {
    questionnaireId = "35b17858-cfac-4c66-80da-434ed2f995c3";

    questionnaire = {
      sections: [
        {
          pages: [
            {
              id: "page-1",
              pageType: "QuestionPage",
              title: "<p>Questions 1</p>",
              description: "",
              answers: [
                {
                  id: "ans-p1-1",
                  description: "",
                  guidance: "",
                  label: "num1",
                  qCode: "123",
                  type: NUMBER,
                  questionPageId: "qp-1",
                  secondaryLabel: null,
                },
                {
                  id: "ans-p1-2",
                  description: "",
                  guidance: "",
                  label: "curr1",
                  qCode: "",
                  type: CURRENCY,
                  questionPageId: "qp-1",

                  secondaryLabel: null,
                },
                {
                  id: "ans-p1-3",
                  description: "",
                  guidance: "",
                  label: "Un1",
                  qCode: "",
                  type: UNIT,
                  questionPageId: "qp-1",

                  secondaryLabel: null,
                },
                {
                  id: "ans-p1-4",
                  description: "",
                  guidance: "",
                  label: "Per1",
                  qCode: "",
                  type: PERCENTAGE,
                  questionPageId: "qp-1",

                  secondaryLabel: null,
                },
                {
                  id: "ans-p1-5",
                  description: "",
                  guidance: "",
                  label: "Dur1",
                  qCode: "",
                  type: DURATION,
                  questionPageId: "qp-1",

                  secondaryLabel: null,
                },
                {
                  id: "ans-p1-6",
                  description: "",
                  guidance: "",
                  label: "Num2",
                  qCode: "",
                  type: NUMBER,
                  questionPageId: "qp-1",

                  secondaryLabel: null,
                },
                {
                  id: "ans-p7-1",
                  description: "",
                  guidance: "",
                  label: "",
                  qCode: "123",
                  type: CHECKBOX,
                  questionPageId: "29ceee38-5ba4-4f43-84ae-0162c5b175f8",
                  options: [
                    {
                      id: "cb-1",
                      label: "Embedded checkbox Either",
                      description: null,
                      additionalAnswer: null,
                      qCode: "123",
                    },
                    {
                      id: "cb-2",
                      label: "Either 2",
                      description: null,
                      additionalAnswer: null,
                    },
                  ],
                  mutuallyExclusiveOption: {
                    id: "cb-3",
                    label: "Embedded checkbox Or",
                    mutuallyExclusive: true,
                    description: null,
                    additionalAnswer: null,
                  },
                },
              ],
            },
            {
              id: "page-2",
              pageType: "QuestionPage",
              title: "<p>Questions 2</p>",
              description: "",
              answers: [
                {
                  id: "ans-p2-1",
                  description: "",
                  guidance: "",
                  label: "Da1",
                  qCode: "",
                  type: DATE,
                  questionPageId: "qp-2",

                  secondaryLabel: null,
                },
              ],
            },
            {
              id: "page-3",
              pageType: "QuestionPage",
              title: "<p>Questions 3</p>",
              description: "",
              answers: [
                {
                  id: "ans-p3-1",
                  description: "",
                  guidance: "",
                  label: "To",
                  secondaryLabel: "From",
                  qCode: "",
                  type: DATE_RANGE,
                  questionPageId: "qp-3",
                },
              ],
            },
            {
              id: "page-4",
              pageType: "QuestionPage",
              title: "<p>Questions 4</p>",
              description: "",
              answers: [
                {
                  id: "ans-p4-1",
                  description: "",
                  guidance: "",
                  label: "TF",
                  qCode: "",
                  type: TEXTFIELD,
                  questionPageId: "qp-4",
                  secondaryLabel: null,
                },
                {
                  id: "ans-p4-2",
                  description: "",
                  guidance: "",
                  label: "TA",
                  qCode: "",
                  type: TEXTAREA,
                  questionPageId: "qp-4",
                  secondaryLabel: null,
                },
              ],
              sectionId: "c1a2aa31-ab46-456a-a1b8-a979c3c345de",
              confirmation: {
                id: "conf-q-1",
                title: "<p>Questions 5</p>",
                qCode: "123",
                positive: {
                  id: "pos-1",
                  label: "Yes",
                  description: "",
                },
                negative: {
                  id: "pos-2",
                  label: "No",
                  description: "",
                },
                __typename: "QuestionConfirmation",
              },
            },
            {
              id: "page-5",
              title: "<p>Questions 6</p>",
              pageType: "CalculatedSummaryPage",
              summaryAnswers: [{ id: "ans-p1-1" }, { id: "ans-p1-6" }],
              sectionId: "c1a2aa31-ab46-456a-a1b8-a979c3c345de",
              alias: null,
              totalTitle: "<p>TT</p>",
              qCode: "123",
            },
            {
              id: "page-6",
              pageType: "QuestionPage",
              title: "<p>Questions 7</p>",
              description: "",
              answers: [
                {
                  id: "ans-p6-1",
                  description: "",
                  guidance: "",
                  label: "",
                  qCode: "",
                  type: RADIO,
                  questionPageId: "qp-6",
                  options: [
                    {
                      id: "option-rad-1",
                      label: "Rad1",
                      description: null,
                      additionalAnswer: null,
                    },
                    {
                      id: "option-rad-2",
                      label: "Rad2",
                      description: null,
                      additionalAnswer: null,
                    },
                  ],
                },
              ],
              routing: null,
              alias: null,
              sectionId: "c1a2aa31-ab46-456a-a1b8-a979c3c345de",
            },
            {
              id: "page-7",
              pageType: "QuestionPage",
              title: "<p>Questions 8</p>",
              description: "",
              answers: [
                {
                  id: "ans-p7-1",
                  description: "",
                  guidance: "",
                  label: "",
                  qCode: "123",
                  type: CHECKBOX,
                  questionPageId: "29ceee38-5ba4-4f43-84ae-0162c5b175f8",
                  options: [
                    {
                      id: "option-cb-1",
                      label: "Either",
                      description: null,
                      additionalAnswer: null,
                      qCode: "123",
                    },
                    {
                      id: "option-cb-3",
                      label: "Either 2",
                      description: null,
                      additionalAnswer: null,
                    },
                  ],
                  mutuallyExclusiveOption: {
                    id: "option-cb-2",
                    label: "Or",
                    mutuallyExclusive: true,
                    description: null,
                    additionalAnswer: null,
                    qCode: "123",
                  },
                },
              ],
              sectionId: "c1a2aa31-ab46-456a-a1b8-a979c3c345de",
            },
          ],
        },
      ],
    };
    props = {
      loading: false,
      data: {
        questionnaire,
      },
    };
    user = {
      id: "1989",
      displayName: "Sir Reginald Hargreeves",
      email: "reggieH@umb.rell.a.ac.uk",
      picture:
        "https://i.pinimg.com/originals/ce/1b/3f/ce1b3f549c222d301991846ccdc25696.jpg",
      admin: true,
    };
    queryWasCalled = false;
    mocks = [
      {
        request: {
          query: UPDATE_ANSWER_QCODE,
          variables: {
            input: {
              id: "ans-p1-1",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateAnswer: {
                id: "ans-p1-1",
                qCode: "187",
                secondaryQCode: "",
                __typename: "BasicAnswer",
              },
            },
          };
        },
      },
      {
        request: {
          query: UPDATE_OPTION_QCODE,
          variables: {
            input: {
              id: "option-cb-1",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateOption: {
                id: "option-cb-1",
                qCode: "187",
                __typename: "BasicAnswer",
              },
            },
          };
        },
      },
      {
        request: {
          query: UPDATE_OPTION_QCODE,
          variables: {
            input: {
              id: "option-cb-2",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateOption: {
                id: "option-cb-2",
                qCode: "187",
                __typename: "BasicAnswer",
              },
            },
          };
        },
      },
      {
        request: {
          query: UPDATE_CONFIRMATION_QCODE,
          variables: {
            input: {
              id: "conf-q-1",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionConfirmation: {
                id: "conf-q-1",
                qCode: "187",
                __typename: "BasicAnswer",
              },
            },
          };
        },
      },
      {
        request: {
          query: UPDATE_CALCSUM_QCODE,
          variables: {
            input: {
              id: "page-5",
              qCode: "187",
              summaryAnswers: ["ans-p1-1", "ans-p1-6"],
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateCalculatedSummaryPage: {
                id: "page-5",
                qCode: "187",
                __typename: "CalculatedSummaryPage",
              },
            },
          };
        },
      },
    ];
  });

  const renderWithContext = (Component, rest) =>
    render(
      <MeContext.Provider value={{ me: user }}>
        <QuestionnaireContext.Provider value={{ questionnaire }}>
          {Component}
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}/qcode`,
        urlParamMatcher: "/q/:questionnaireId/qcode",
        mocks,
        ...rest,
      }
    );

  it("Should render a loading component", async () => {
    props = {
      ...props,
      loading: true,
    };
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const target = getByTestId("loading");
    expect(target).toBeTruthy();
  });

  it("Should render an error component", async () => {
    props = {
      ...props,
      error: { error: {} },
    };
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const target = getByTestId("error");
    expect(target).toBeTruthy();
  });

  it("Should render fields", async () => {
    const { getByText } = renderWithContext(<UnwrappedQCodeTable {...props} />);
    const fieldHeadings = [
      "Short code",
      "Question",
      "Type",
      "Answer label",
      "Qcode",
    ];
    fieldHeadings.forEach(heading => expect(getByText(heading)).toBeTruthy());
  });

  it("Should render rows equivalent to the amount of Questions", () => {
    const { getAllByText, getByText } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const renderedQuestions = getAllByText(content =>
      content.startsWith("Questions")
    );

    const confirmationQuestion = getByText("Questions 5");
    expect(confirmationQuestion).toBeTruthy();
    expect(getAllByText("Mutually exclusive checkbox").length).toEqual(2);
    expect(getByText("Embedded checkbox Either")).toBeTruthy();
    expect(getByText("Embedded checkbox Or")).toBeTruthy();
    expect(getByText("From")).toBeTruthy();
    expect(renderedQuestions.length).toEqual(8);
  });

  it("Should make query to update Answer", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "ans-p1-1-test-input";
    const originalValue = "123";
    const input = getByTestId(testId);
    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, { target: { value: "187" } });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });

  it("Should make query to update Option", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "option-cb-1-test-input";
    const originalValue = "123";

    const input = getByTestId(testId);

    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, { target: { value: "187" } });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });

  it("Should make query to update mutually exclusive Option", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "option-cb-2-test-input";
    const originalValue = "123";

    const input = getByTestId(testId);

    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, { target: { value: "187" } });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });

  it("Should make query to update confirmation", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "conf-q-1-test-input";
    const originalValue = "123";
    const input = getByTestId(testId);
    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, { target: { value: "187" } });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });

  it("Should make query to update calculated summary", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "page-5-test-input";
    const originalValue = "123";
    const input = getByTestId(testId);
    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, {
        target: { value: "187" },
      });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });
});
