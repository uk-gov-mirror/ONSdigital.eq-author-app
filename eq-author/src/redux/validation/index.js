import { merge, get } from "lodash";

export const UPDATE = "UPDATE";

const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case UPDATE:
      return merge({}, state, {
        [payload.pageId]: payload.validation
      });

    default:
      return state;
  }
};

export const updateValidation = payload => ({
  type: UPDATE,
  payload
});

export const getValidation = (state, pageId) => {
  return {
    comparator: "Equals",
    custom: "",
    enabled: true,
    entityType: "Custom",
    id: "minValue",
    inclusive: true,
    previousAnswer: null,
    ...get(state, pageId)
  };
};
