export const ADD_PAGE = "ADD_PAGE";
export const ADD_ANSWER = "ADD_ANSWER";
export const REMOVE_ANSWER = "REMOVE_ANSWER";

const initialState = {
  questionnaires: [
    {
      id: "2",
      sections: [
        {
          id: "2",
          pages: [
            {
              position: 0,
              id: "9999",
              type: "__Summary",
              title:
                "We calculate the total of unit values entered to be %(total)s. Is this correct?",
              answers: [],
              totalTitle: "Grand total of previous values",
            },
          ],
        },
      ],
    },
  ],
};

let pageIds = 0;

const getNewPageId = () => {
  pageIds++;
  return pageIds;
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_ANSWER:
      return { ...state, ...payload };

    case ADD_PAGE:
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

export const addAnswer = payload => ({
  type: ADD_ANSWER,
  payload,
});

export const removeAnswer = payload => ({
  type: REMOVE_ANSWER,
  payload,
});
