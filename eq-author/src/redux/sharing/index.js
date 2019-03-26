import { without, merge, get } from "lodash";

export const ADD_USER = "ADD_USER";
export const REMOVE_USER = "REMOVE_USER";
export const TOGGLE_PUBLIC = "TOGGLE_PUBLIC";

const initialState = {};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_USER: {
      const { user, questionnaireId } = payload;
      const questionnaire = get(state, questionnaireId, { users: [] });
      const users = get(questionnaire, "users");
      const newUser = {
        ...user,
        owner: user.owner || false,
        picture: user.picture || false,
      };
      return merge({}, state, {
        [questionnaireId]: { users: [newUser, ...users] },
      });
    }

    case REMOVE_USER: {
      const { user, questionnaireId } = payload;
      return {
        ...state,
        [questionnaireId]: {
          ...state[questionnaireId],
          users: without(state[questionnaireId].users, user),
        },
      };
    }

    case TOGGLE_PUBLIC: {
      const { questionnaireId } = payload;
      const currentState = get(state, questionnaireId);
      return {
        ...state,
        [questionnaireId]: {
          ...currentState,
          public: !get(currentState, "public", true),
        },
      };
    }

    default:
      return state;
  }
};

export const addUser = payload => ({
  type: ADD_USER,
  payload,
});

export const removeUser = payload => ({
  type: REMOVE_USER,
  payload,
});

export const togglePublic = payload => ({
  type: TOGGLE_PUBLIC,
  payload,
});
