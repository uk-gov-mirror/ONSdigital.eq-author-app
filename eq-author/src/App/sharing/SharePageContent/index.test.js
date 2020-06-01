import React from "react";
import { render, act, flushPromises, fireEvent } from "tests/utils/rtl";

import { Sharing, TogglePublicLabel } from "./index";

jest.mock("./EditorSearch.js", () => {
  const EditorSearch = () => <div />;
  return EditorSearch;
});

const renderSharing = (props, mocks) => {
  return render(<Sharing {...props} {...mocks} />);
};

let props;

beforeEach(() => {
  props = {
    data: {
      questionnaire: {
        id: "1",
        isPublic: true,
        createdBy: {
          id: "2",
          name: "Owner",
          email: "owner@email.com",
        },
        editors: [
          {
            id: "2",
            name: "Owner",
            email: "owner@email.com",
          },
          {
            id: "4",
            name: "Ed",
            email: "Ed@email.com",
          },
        ],
      },
    },
    showToast: jest.fn(),
  };
});

afterEach(async () => {
  await act(async () => {
    await flushPromises();
  });
});

describe("Share Page", () => {
  it("should render", () => {
    const wrapper = renderSharing(props);
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

  it("should have shareable link", async () => {
    const originalExecCommand = document.execCommand;
    let selectedText = "no text selected";
    document.execCommand = command => {
      if (command === "copy") {
        // jsdom has not implemented textselection so we we have do the next best thing
        selectedText = document.querySelector("[data-test='share-link']")
          .innerText;
      }
    };
    const { getByText } = renderSharing(props);
    await act(async () => {
      await flushPromises();
    });

    const linkButton = getByText("Get shareable link");

    fireEvent.click(linkButton);
    expect(selectedText).toMatch(
      new RegExp(`/launch/${props.data.questionnaire.id}$`)
    );

    expect(props.showToast).toHaveBeenCalled();
    document.execCommand = originalExecCommand;
  });

  it("should be able to toggle public access", () => {});
});
