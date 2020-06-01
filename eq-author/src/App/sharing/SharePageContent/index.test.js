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

let props, mocks;

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
  mocks = {
    handleShareClick: jest.fn(),
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

  it("should have shareable link", () => {
    const wrapper = renderSharing(props, mocks);
    // const { getByTestId } = renderSharing(props, mocks);
    const { getByTestId } = wrapper;
    jest.spyOn(wrapper, "handleShareClick");
    const shareButton = getByTestId("share-button");
    expect(shareButton).toBeTruthy();

    fireEvent.click(shareButton);
    expect(mocks.handleShareClick).toHaveBeenCalled();
  });

  it("should be able to alter public access", () => {});

  it("should have only the owner", () => {});

  it("should be able to add an editor", () => {});

  it("should display editors and owner", () => {});

  it("should be able to delete editor", () => {});
});
