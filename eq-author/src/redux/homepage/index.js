import { clamp } from "lodash";

export const SEARCH = "SEARCH";
export const SORT = "SORT";
export const HIDE_READONLY = "HIDE_READONLY";
export const CURRENT_PAGE = "CURRENT_PAGE";

export const ASC = "ascending";
export const DESC = "descending";

const initialState = {
  searchTerm: "",
  sort: {
    by: "createdAt",
    order: DESC,
  },
  hideReadOnly: true,
  currentPage: 1,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SEARCH: {
      return { ...state, searchTerm: payload.searchTerm };
    }

    case SORT: {
      let order;

      if (state.sort.by === payload.sortKey) {
        order = state.sort.order === ASC ? DESC : ASC;
      } else {
        order = ASC;
      }

      return {
        ...state,
        sort: {
          by: payload.sortKey,
          order,
        },
      };
    }

    case HIDE_READONLY: {
      return { ...state, hideReadOnly: payload.hideReadOnly };
    }

    case CURRENT_PAGE: {
      return {
        ...state,
        currentPage: payload.page,
      };
    }

    default:
      return state;
  }
};

export const setSearchTerm = searchTerm => ({
  type: SEARCH,
  payload: { searchTerm },
});

export const setSort = sortKey => ({
  type: SORT,
  payload: { sortKey },
});

export const setHideReadOnly = hideReadOnly => ({
  type: HIDE_READONLY,
  payload: { hideReadOnly },
});

export const setCurrentPage = (page, totalPages) => ({
  type: CURRENT_PAGE,
  payload: { page, totalPages },
});
