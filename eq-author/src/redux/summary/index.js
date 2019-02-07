import { remove } from "lodash";

export const ADD_PAGE = "ADD_PAGE";
export const DELETE_PAGE = "DELETE_PAGE";

export const ADD_ANSWER = "ADD_ANSWER";
export const REMOVE_ANSWER = "REMOVE_ANSWER";

let pageId = 9999999;

const getNewPageId = () => {
  pageId--;
  return pageId.toString();
};

const createPage = ({ questionnaireId, sectionId, position }) => {
  const id = getNewPageId();
  return {
    id: getNewPageId(),
    questionnaireId: "1",
    sectionId: "1",
    confirmation: null,
    position,
    __typename: "SummaryPage",
    displayName: `Summary ${id}`,
    title:
      "We calculate the total of unit values entered to be %(total)s. Is this correct?",
    answers: [],
    totalTitle: "Grand total of previous values",
  };
};

const initialState = {
  pages: [
    createPage({ questionnaireId: "1", sectionId: "1", position: 1 }),
    createPage({ questionnaireId: "1", sectionId: "1", position: 2 }),
    createPage({ questionnaireId: "1", sectionId: "1", position: 3 }),
  ],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_PAGE: {
      return {
        ...state,
        pages: state.pages.concat(createPage(payload)),
      };
    }

    case DELETE_PAGE: {
      return {
        ...state,
        pages: remove(state.pages, ({ id }) => id !== payload.id),
      };
    }

    case ADD_ANSWER:
      return { ...state, ...payload };

    case REMOVE_ANSWER:
      return { ...state, ...payload };

    default:
      return state;
  }
};

export const addSummaryPage = payload => ({
  type: ADD_PAGE,
  payload,
});

export const deleteSummaryPage = payload => ({
  type: DELETE_PAGE,
  payload,
});

export const addAnswer = payload => ({
  type: ADD_ANSWER,
  payload,
});

export const removeAnswer = payload => ({
  type: REMOVE_ANSWER,
  payload,
});
