import React from "react";
import { render, act, flushPromises, fireEvent } from "tests/utils/rtl";

import ADD_REMOVE_EDITOR from "../graphql/AddRemoveEditor.graphql";

import { EditorSearch } from "./EditorSearch";

const renderEditorSearch = (props, mocks) => {
  return render(<EditorSearch {...props} />, { mocks });
};

describe("Editor search", () => {
  let props, mocks, queryWasCalled, editors;
  beforeEach(() => {
    editors = [
      { id: "4", name: "Fred", email: "Fred@mail.com" },
      { id: "5", name: "George", email: "George@mail.com" },
      { id: "6", name: "Albert", email: "Albert@mail.com" },
    ];

    props = {
      questionnaireId: "1",
      users: [
        { id: "2", name: "UserThomas", email: "thomas@mail.com" },
        { id: "3", name: "UserJack", email: "jack@mail.com" },
      ],
      owner: { id: "2", name: "OwnerThomas", email: "OwnerThomas@mail.com" },
      editors: [],
    };

    mocks = [
      {
        request: {
          query: ADD_REMOVE_EDITOR,
          variables: {
            input: {
              id: props.questionnaireId,
              editors: ["4", "6"],
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionnaire: {
                id: props.questionnaireId,
                editors: [
                  {
                    id: "4",
                    name: "Fred",
                    email: "Fred@mail.com",
                    picture: "mypicture",
                    __typename: "User",
                  },
                  {
                    id: "6",
                    name: "Albert",
                    email: "Albert@mail.com",
                    picture: "mypicture",
                    __typename: "User",
                  },
                ],
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
    ];
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  it("should render", () => {
    const wrapper = renderEditorSearch(props);
    expect(wrapper).toMatchSnapshot({
      history: {
        entries: [
          {
            key: expect.any(String),
          },
        ],
        location: {
          key: expect.any(String),
        },
      },
    });
  });

  it("should display owner", () => {
    const { queryByTestId } = renderEditorSearch(props);
    const tests = ["user-item", "user-name", "user-owner", "user-email"];
    const [user, name, owner, email] = tests.map(x => queryByTestId(x));

    expect(user).toBeTruthy();
    expect(name).toBeTruthy();
    expect(owner).toBeTruthy();
    expect(email).toBeFalsy();
  });

  it("should display owner email if name is null", () => {
    props.owner.name = null;

    const { queryByTestId } = renderEditorSearch(props);
    const tests = ["user-item", "user-name", "user-owner", "user-email"];
    const [user, name, owner, email] = tests.map(x => queryByTestId(x));

    expect(user).toBeTruthy();
    expect(name).toBeFalsy();
    expect(owner).toBeTruthy();
    expect(email).toBeTruthy();
  });

  it("should display editors", () => {
    props.editors = editors;

    const { queryAllByTestId } = renderEditorSearch(props);

    const tests = ["user-item", "user-name", "user-owner", "user-email"];
    const [user, name, owner, email] = tests.map(x => queryAllByTestId(x));

    expect(user.length).toEqual(4);
    expect(name.length).toEqual(4);
    expect(owner.length).toEqual(1);
    expect(email.length).toEqual(3);
  });

  it("should remove editor from list", async () => {
    props.editors = editors;
    const TARGET = "George";
    const { queryAllByTestId, queryByText, rerender } = render(
      <EditorSearch {...props} />,
      {
        mocks,
      }
    );

    const tests = ["user-item", "user-name", "user-owner", "user-email"];
    const [user, name, owner, email] = tests.map(x => queryAllByTestId(x));

    expect(user.length).toEqual(4);
    expect(name.length).toEqual(4);
    expect(owner.length).toEqual(1);
    expect(email.length).toEqual(3);
    expect(queryByText(TARGET)).toBeTruthy();

    const removeButton = queryAllByTestId("user-remove-btn");

    await act(async () => {
      fireEvent.click(removeButton[1]);
      flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();

    const updatedEditors = editors.filter(editor => editor.name !== TARGET);
    props.editors = updatedEditors;

    rerender(<EditorSearch {...props} />);

    const [
      userUpdated,
      nameUpdated,
      ownerUpdated,
      emailUpdated,
    ] = tests.map(x => queryAllByTestId(x));

    expect(userUpdated.length).toEqual(3);
    expect(nameUpdated.length).toEqual(3);
    expect(ownerUpdated.length).toEqual(1);
    expect(emailUpdated.length).toEqual(2);
    expect(queryByText(TARGET)).toBeFalsy();
  });

  // it("should display owner", () => {
  //   const { queryByTestId } = renderEditorSearch(props);
  //   const tests = ["user-item", "user-name", "user-owner", "user-email"];
  //   const [user, name, owner, email] = tests.map(x => queryByTestId(x));

  //   expect(user).toBeTruthy();
  //   expect(name).toBeTruthy();
  //   expect(owner).toBeTruthy();
  //   expect(email).toBeFalsy();
  // });
  // it("should display owner email if name is null", () => {
  //   props.owner.name = null;

  //   const { queryByTestId } = renderEditorSearch(props);
  //   const tests = ["user-item", "user-name", "user-owner", "user-email"];
  //   const [user, name, owner, email] = tests.map(x => queryByTestId(x));

  //   expect(user).toBeTruthy();
  //   expect(name).toBeFalsy();
  //   expect(owner).toBeTruthy();
  //   expect(email).toBeTruthy();
  // });

  // it("should display editors", () => {
  //   props.editors = [
  //     { id: "4", name: "Fred", email: "Fred@mail.com" },
  //     { id: "5", name: "George", email: "George@mail.com" },
  //     { id: "6", name: "Albert", email: "Albert@mail.com" },
  //   ];

  //   const {
  //     queryAllByTestId,
  //     // queryByTestId,
  //     // getByText,
  //     // debug,
  //   } = renderEditorSearch(props, { mocks });

  //   const tests = ["user-item", "user-name", "user-owner", "user-email"];
  //   const [user, name, owner, email] = tests.map(x => queryAllByTestId(x));

  //   expect(user.length).toEqual(4);
  //   expect(name.length).toEqual(4);
  //   expect(owner.length).toEqual(1);
  //   expect(email.length).toEqual(3);

  //   // const input = queryByTestId("user-search");
  //   // expect(input.value).toEqual("");

  //   // fireEvent.change(input, {
  //   //   target: { value: "UserThomas" },
  //   // });

  //   // expect(input.value).toEqual("UserThomas");
  //   // const downshiftName = getByText("UserThomas");
  //   // expect(downshiftName).toBeTruthy();

  //   // const submitButton = getByText("Add");
  //   // // debug();
  //   // fireEvent.click(submitButton);
  //   // expect(addUser).toHaveBeenCalled();
  // });
});
