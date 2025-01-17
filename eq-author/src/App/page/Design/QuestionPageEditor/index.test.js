import { UnwrappedQuestionPageEditor } from "./";

import React from "react";
import { shallow } from "enzyme";

jest.mock("components/NavigationCallbacks", () => ({
  useSetNavigationCallbacksForPage: () => null,
}));

describe("Question Page Editor", () => {
  let wrapper;

  let mockHandlers;
  let page;
  let section;
  let questionnaire;

  const answer = {
    id: "123",
    __typename: "Answer",
  };

  const match = {
    params: {
      questionnaireId: "1",
      sectionId: "2",
      pageId: "3",
    },
  };

  const render = ({ ...props }) => {
    return shallow(
      <UnwrappedQuestionPageEditor
        {...mockHandlers}
        questionnaire={questionnaire}
        page={page}
        section={section}
        showMovePageDialog={false}
        showDeleteConfirmDialog={false}
        match={match}
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockHandlers = {
      onUpdateAnswer: jest.fn(),
      onUpdatePage: jest.fn(),
      onDeletePageConfirm: jest.fn(),
      onCloseDeleteConfirmDialog: jest.fn(),
      onAddAnswer: jest.fn(() => Promise.resolve(answer)),
      onAddOption: jest.fn(),
      fetchAnswers: jest.fn(),
      onDeleteOption: jest.fn(),
      onDeleteAnswer: jest.fn(),
      onAddExclusive: jest.fn(),
      onUpdateOption: jest.fn(),
      onMovePage: jest.fn(),
      onCloseMovePageDialog: jest.fn(),
      onAddOther: jest.fn(),
      onDeleteOther: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
    };

    page = {
      __typename: "Page",
      id: "1",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      alias: "Who am I?",
      pageType: "QuestionPage",
      description: "<p>Description</p>",
      descriptionEnabled: true,
      guidance: "<p>Guidance</p>",
      guidanceEnabled: true,
      definitionLabel: "<p>Definition Label</p>",
      definitionContent: "<p>Definition Content</p>",
      definitionEnabled: true,
      additionalInfoLabel: "<p>Additional Info Label</p>",
      additionalInfoContent: "<p>Additional Info Content</p>",
      additionalInfoEnabled: true,
      validationErrorInfo: [],
      answers: [
        {
          __typename: "BasicAnswer",
          id: "1",
          title: "First name",
          description: "",
          type: "TextField",
        },
        {
          __typename: "BasicAnswer",
          id: "2",
          title: "Last name",
          description: "",
          type: "TextField",
        },
      ],
    };

    section = {
      id: "3",
      pages: [page],
    };

    questionnaire = {
      id: "1",
      __typename: "Questionnaire",
      sections: [section],
    };

    wrapper = render({});
  });

  it("should delete the correct answer", () => {
    wrapper
      .find("[data-test='answers-editor']")
      .first()
      .simulate("deleteAnswer", page.answers[0].id);

    expect(mockHandlers.onDeleteAnswer).toHaveBeenCalledWith(
      page.id,
      page.answers[0].id
    );
  });

  it("should add an answer with a type", () => {
    wrapper.find("[data-test='add-answer']").simulate("select", "Textfield");
    expect(mockHandlers.onAddAnswer).toHaveBeenCalledWith(
      match.params.pageId,
      "Textfield"
    );
  });
});
