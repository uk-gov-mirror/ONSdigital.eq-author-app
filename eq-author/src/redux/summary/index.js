export const ADD_PAGE = "ADD_PAGE";
export const ADD_ANSWER = "ADD_ANSWER";
export const REMOVE_ANSWER = "REMOVE_ANSWER";

let pageId = 9999999;

const getNewPageId = () => {
  pageId--;
  return pageId.toString();
};

const getPage = position => {
  const id = getNewPageId();
  return {
    id: getNewPageId(),
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
  questionnaires: [
    {
      id: "2",
      sections: [
        {
          id: "2",
          pages: [getPage(0), getPage(1), getPage(3)],
        },
      ],
    },
  ],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_ANSWER:
      return { ...state, ...payload };

    case ADD_PAGE: {
        const { questionnaireId, sectionId, position } = payload;


        return { 
            ...state, 
            questionnaires: [
              ...state.questionnaires[questionnaireId],
              sections: [
                  ...state.questionnaires[questionnaireId].sections[sectionId],
                  pages: [
                      
                  ]
  
              ]
          ]  
      }
    }
      

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
