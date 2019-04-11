import { flowRight, find, filter, flatMap, map, get } from "lodash";
import withFetchAnswers from "App/questionPage/Design/QuestionPageEditor/withFetchAnswers";
import { connect } from "react-redux";
import withQuestionnaire from "App/QuestionnairesPage/withQuestionnaire";
import {
  deleteSummaryPage,
  updateSummaryPage,
  addAnswer,
  addAnswers,
  removeAnswer,
  removeAnswers,
} from "redux/summary";

import { CURRENCY, NUMBER, PERCENTAGE } from "constants/answer-types";

const getAnswersofTypeFromSection = (type, section) =>
  flatMap(
    map(section.pages, page =>
      filter(page.answers, {
        type,
      })
    )
  );

const mapState = (state, ownProps) => {
  const { questionnaire } = ownProps;
  const { pageId, sectionId } = ownProps.match.params;

  const page = find(state.summary.pages, {
    id: pageId,
  });

  if (questionnaire) {
    const answerType = get(page.answers, ["0", "type"]);

    const currentSection = find(questionnaire.sections, { id: sectionId });

    const previousSections = [...questionnaire.sections].splice(
      0,
      questionnaire.sections.indexOf(currentSection) + 1
    );

    const previousSection = previousSections[previousSections.length - 2];

    const currencyAnswersinCurrentSection = getAnswersofTypeFromSection(
      CURRENCY,
      currentSection
    );

    const numberAnswersinCurrentSection = getAnswersofTypeFromSection(
      NUMBER,
      currentSection
    );

    const percentageAnswersinCurrentSection = getAnswersofTypeFromSection(
      PERCENTAGE,
      currentSection
    );

    return {
      page,
      previousSections,
      answerType,
      suggestions: {
        currentSection,
        previousSection,
        currencyAnswersinCurrentSection,
        numberAnswersinCurrentSection,
        percentageAnswersinCurrentSection,
      },
    };
  }

  return {
    page,
    answerType: "undefined",
  };
};

const mapDispatch = (dispatch, ownProps) => ({
  deletePage: id => dispatch(deleteSummaryPage({ id })),
  onChange: ({ name, value }) =>
    dispatch(
      updateSummaryPage({ id: ownProps.match.params.pageId, [name]: value })
    ),
  onUpdate: ({ name, value }) =>
    dispatch(
      updateSummaryPage({ id: ownProps.match.params.pageId, [name]: value })
    ),
  addAnswer: answer =>
    dispatch(addAnswer({ pageId: ownProps.match.params.pageId, answer })),
  addAnswers: answers =>
    dispatch(addAnswers({ pageId: ownProps.match.params.pageId, answers })),
  removeAnswer: answer =>
    dispatch(removeAnswer({ pageId: ownProps.match.params.pageId, answer })),
  removeAnswers: () =>
    dispatch(removeAnswers({ pageId: ownProps.match.params.pageId })),
});

export default flowRight(
  withQuestionnaire,
  connect(
    mapState,
    mapDispatch
  ),

  withFetchAnswers
);
