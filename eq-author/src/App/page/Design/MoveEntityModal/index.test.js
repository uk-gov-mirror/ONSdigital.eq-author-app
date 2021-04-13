import React from "react";
import MoveEntityModal, { buildPageList } from ".";
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
} from "tests/utils/rtl";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { useQuestionnaire } from "components/QuestionnaireContext";

jest.mock("components/QuestionnaireContext", () => ({
  __esModule: true,
  useQuestionnaire: jest.fn(),
}));

const mockQuestionnaire = buildQuestionnaire({ sectionCount: 2 });
const currentSection = mockQuestionnaire.sections[0];
const currentPage = currentSection.folders[0].pages[0];

useQuestionnaire.mockImplementation(() => ({
  questionnaire: mockQuestionnaire,
}));
const onMove = jest.fn();
function setup(props) {
  const utils = render(
    <MoveEntityModal
      entity="Page"
      isOpen
      onClose={jest.fn()}
      sectionId={currentSection.id}
      selected={currentPage}
      onMove={onMove}
      {...props}
    />
  );
  return { ...utils, onMove };
}

describe("MovePageModal", () => {
  beforeEach(() => setup());

  it("should render rtl", () => {
    expect(screen.getByTestId("move-modal")).toBeVisible();
  });

  it("should open section select modal", () => {
    expect(screen.queryByTestId("section-item-select")).toBeNull();
    fireEvent.click(screen.getByText(/Section 1/));
    expect(screen.queryByTestId("section-item-select")).toBeVisible();
  });

  it("should close select modal on select", async () => {
    fireEvent.click(screen.getByText(/Section 1/));

    fireEvent.click(screen.getByText(/Select/));

    await waitForElementToBeRemoved(() => screen.queryByText(/Select/i));
    expect(screen.queryByText(/Select/)).toBeNull();
  });

  it("should close select modal on cancel", async () => {
    fireEvent.click(screen.getByText(/Section 1/));

    fireEvent.click(screen.getByText(/Cancel/));

    await waitForElementToBeRemoved(() => screen.queryByText(/Cancel/i));
    expect(screen.queryByText(/Cancel/)).toBeNull();
  });

  it("should update selection on change", async () => {
    fireEvent.click(screen.getByText(/Section 1/));

    fireEvent.click(screen.getByText(/Section 2/));
    fireEvent.click(screen.getByText(/Select/));
    await waitForElementToBeRemoved(() => screen.queryByText(/Select/i));
    expect(screen.queryByText(/Section 1/)).toBeNull();
    expect(screen.queryByText(/Section 2/)).toBeVisible();
  });
});

describe("MovePageModal: questionnaire not loaded", () => {
  it("shouldn't render if questionnaire not yet available", () => {
    useQuestionnaire.mockImplementation(() => ({
      questionnaire: undefined,
    }));

    setup({ selected: null });

    expect(screen.queryByTestId("move-modal")).toBeNull();
  });
});
describe("MovePageModal: buildPageList", () => {
  let output, folders;

  beforeEach(() => {
    folders = [
      {
        id: "folder-1",
        enabled: true,
        position: 0,
        __typename: "Folder",
        pages: [
          {
            id: "folder-1-page-1",
            position: 0,
          },
          {
            id: "folder-1-page-2",
            position: 1,
          },
        ],
      },
      {
        id: "folder-2",
        enabled: false,
        position: 1,
        pages: [
          {
            id: "folder-2-page-1",
            position: 2,
          },
        ],
      },
    ];
    output = buildPageList(folders);
  });

  it("should include enabled folders in output", () => {
    expect(
      output.filter(({ __typename }) => __typename === "Folder")[0]
    ).toMatchObject({
      __typename: "Folder",
      parentEnabled: false,
      enabled: true,
    });
  });

  it("should not included disabled folders in output", () => {
    expect(
      output.filter(({ enabled, type }) => !enabled && type === "Folder")
    ).toHaveLength(0);
  });

  it("should include parent details on enabled folders", () => {
    expect(output.filter(({ id }) => id.startsWith("folder-1-page"))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          parentEnabled: true,
          parentId: output[0].id,
          position: expect.any(Number),
        }),
      ])
    );
  });

  it("should have null parentId for disabled folders", () => {
    const [target] = output.filter(({ id }) => id.includes("folder-2"));
    expect(target.parentId).toBeNull();
  });
});
