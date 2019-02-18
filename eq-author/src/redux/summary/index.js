import { remove, map, unionWith, without, isEqual } from "lodash";

export const ADD_PAGE = "ADD_PAGE";
export const DELETE_PAGE = "DELETE_PAGE";
export const UPDATE_PAGE = "UPDATE_PAGE";

export const ADD_ANSWER = "ADD_ANSWER";
export const ADD_ANSWERS = "ADD_ANSWERS";
export const REMOVE_ANSWER = "REMOVE_ANSWER";
export const REMOVE_ANSWERS = "REMOVE_ANSWERS";

const createPage = ({ questionnaireId, sectionId, pageId, position }) => {
  return {
    __typename: "SummaryPage",
    alias: "",
    id: pageId,
    questionnaireId,
    sectionId,
    confirmation: null,
    position,
    displayName: "Untitled Summary Page",
    title: "",
    answers: [],
    totalTitle: "",
  };
};

const initialState = {
  pages: [],
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

    case UPDATE_PAGE: {
      return {
        ...state,
        pages: map(state.pages, page => {
          if (page.id === payload.id) {
            const newState = {
              ...page,
              ...payload,
            };

            const displayName = newState.alias || "Untitled Summary Page ";

            return {
              ...newState,
              displayName,
            };
          } else {
            return page;
          }
        }),
      };
    }

    case ADD_ANSWER:
      return {
        ...state,
        pages: state.pages.map(page => {
          const newPage = { ...page };
          if (page.id === payload.pageId) {
            newPage.answers = unionWith(
              page.answers,
              [payload.answer],
              isEqual
            );
          }

          return newPage;
        }),
      };

    case ADD_ANSWERS: {
      return {
        ...state,
        pages: state.pages.map(page => {
          const newPage = { ...page };
          if (page.id === payload.pageId) {
            newPage.answers = unionWith(page.answers, payload.answers, isEqual);
          }

          return newPage;
        }),
      };
    }

    case REMOVE_ANSWER: {
      return {
        ...state,
        pages: state.pages.map(page => {
          const newPage = { ...page };
          if (page.id === payload.pageId) {
            newPage.answers = page.answers.filter(
              answer => answer.id !== payload.answer.id
            );
          }

          return newPage;
        }),
      };
    }

    case REMOVE_ANSWERS: {
      return {
        ...state,
        pages: state.pages.map(page => {
          const newPage = { ...page };
          if (page.id === payload.pageId) {
            newPage.answers = [];
          }

          return newPage;
        }),
      };
    }

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

export const updateSummaryPage = payload => ({
  type: UPDATE_PAGE,
  payload,
});

export const addAnswer = payload => ({
  type: ADD_ANSWER,
  payload,
});

export const addAnswers = payload => ({
  type: ADD_ANSWERS,
  payload,
});

export const removeAnswer = payload => ({
  type: REMOVE_ANSWER,
  payload,
});

export const removeAnswers = payload => ({
  type: REMOVE_ANSWERS,
  payload,
});
