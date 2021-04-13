import React from "react";
import PositionModal from "./";
import {
  render,
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "tests/utils/rtl";
import { buildSections } from "tests/utils/createMockQuestionnaire";

describe("PositionModal", () => {
  const options = buildSections({ sectionCount: 5 });
  const onMove = jest.fn();
  const setup = (props = {}) =>
    render(
      <PositionModal
        title="Section"
        options={options}
        isOpen
        onClose={jest.fn()}
        onMove={onMove}
        selected={options[0]}
        {...props}
      />
    );

  beforeEach(() => setup());

  it("should render", () => {
    expect(screen.getByTestId("section-position-modal")).toBeVisible();
  });

  it("should open when clicked", () => {
    fireEvent.click(screen.getByText(/Section 1/));
    expect(screen.getByTestId("section-item-select")).toBeVisible();
  });

  it("should close on select", async () => {
    fireEvent.click(screen.getByText(/Section 1/));
    fireEvent.click(screen.getByText(/Select/));
    await waitForElementToBeRemoved(() => screen.getByText(/Select/));
    expect(screen.queryByText(/Select/)).not.toBeInTheDocument();
  });

  it("should close on cancel", async () => {
    fireEvent.click(screen.getByText(/Section 1/));
    fireEvent.click(screen.getByText(/Cancel/));
    await waitForElementToBeRemoved(() => screen.getByText(/Cancel/));
    expect(screen.queryByText(/Cancel/)).not.toBeInTheDocument();
  });

  it("should update selected on change", () => {
    fireEvent.click(screen.getByText(/Section 1/));
    fireEvent.click(screen.getByText(/Section 2/));
    fireEvent.click(screen.getByText(/Select/));
    // await waitForElementToBeRemoved(() => screen.getByText(/Select/));
    expect(onMove).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: "Section 2",
      })
    );
  });

  it("should reset the position if modal is closed", async () => {
    fireEvent.click(screen.getByText(/Section 1/));
    fireEvent.click(screen.getByText(/Section 2/));
    fireEvent.click(screen.getByText(/Cancel/));
    await waitForElementToBeRemoved(() => screen.getByText(/Cancel/));

    expect(screen.getByText(/Section 1/)).toBeVisible();
    expect(screen.queryByText(/Section 2/)).not.toBeInTheDocument();
  });

  describe("Positioning behaviours", () => {
    let options;
    function openModalState(selected = 0) {
      const utils = setup({
        title: "Page",
        options,
        selected: options[selected],
      });
      fireEvent.click(screen.getByText(/question 1/));
      return { ...utils };
    }
    beforeEach(() => {
      options = [
        {
          id: "question-1",
          displayName: "question 1",
          parentEnabled: false,
        },
        {
          id: "Folder-1",
          displayName: "Folder 1",
          __typename: "Folder",
        },
        {
          id: "question-2",
          displayName: "question 2",
          parentEnabled: true,
          parentId: "Folder-1",
        },
        {
          id: "question-3",
          displayName: "question 3",
          parentEnabled: true,
          parentId: "Folder-1",
        },
        {
          id: "question-4",
          displayName: "question 4",
          parentEnabled: false,
        },
        {
          id: "Folder-2",
          displayName: "Folder 2",
          __typename: "Folder",
        },
        {
          id: "question-5",
          displayName: "question 5",
          parentEnabled: true,
          parentId: "Folder-2",
        },
        {
          id: "question-6",
          displayName: "question 6",
          parentEnabled: true,
          parentId: "Folder-2",
        },
      ];
      openModalState();
    });

    it("should jump length of folder when clicking on a folder", () => {
      const first = screen.getAllByText(/question 1/)[1].textContent;
      const firstOption = screen.getAllByTestId("options")[0].textContent;
      expect(first).toEqual(firstOption);

      fireEvent.click(screen.getByText(/Folder 1/));

      expect(screen.getAllByTestId("options")[3].textContent).toEqual(first);
    });

    // should test parentId here

    // it("should go into the correct position in folder going down", () => {
    //   const wrapper = openModalState();
    //   const value = 2;
    //   getItemSelect(wrapper).simulate("change", { value });
    //   expect(getItemSelect(wrapper).prop("value")).toBe(value.toString());
    //   expect(
    //     wrapper.find("PositionModal__Indent").getElements()[value].props
    //       .children
    //   ).toEqual(options[0].displayName);
    //   expect(
    //     wrapper.find("PositionModal__Indent").getElements()[value].props.indent
    //   ).toBeTruthy();
    // });

    // it("should go into the correct position in folder going up", () => {
    //   const selected = 4;
    //   const wrapper = openModalState(selected);
    //   const value = 2;
    //   getItemSelect(wrapper).simulate("change", { value });
    //   expect(getItemSelect(wrapper).prop("value")).toBe(value.toString());

    //   expect(
    //     wrapper.find("PositionModal__Indent").getElements()[value].props
    //       .children
    //   ).toEqual(options[selected].displayName);
    // });

    // it("should go to the correct position when selecting the same value twice", () => {
    //   const wrapper = openModalState();
    //   const value = 1;
    //   getItemSelect(wrapper).simulate("change", { value });

    //   getItemSelect(wrapper).simulate("change", { value: 0 });

    //   expect(getItemSelect(wrapper).prop("value")).toBe((0).toString());

    //   expect(
    //     wrapper.find("PositionModal__Indent").getElements()[0].props.children
    //   ).toEqual(options[0].displayName);
    // });

    // it("should move between folders correctly", () => {
    //   const initial = 2;
    //   const wrapper = openModalState(initial);
    //   const after = 6;
    //   getItemSelect(wrapper).simulate("change", { value: after });

    //   expect(getItemSelect(wrapper).prop("value")).toBe(after.toString());

    //   expect(
    //     wrapper.find("PositionModal__Indent").getElements()[after].props
    //       .children
    //   ).toEqual(options[initial].displayName);
    // });

    it("should display the correct styling", () =>
      expect(screen.getAllByTestId("options")[3]).toHaveStyleRule(
        "margin-left",
        "1em"
      ));
  });
});
