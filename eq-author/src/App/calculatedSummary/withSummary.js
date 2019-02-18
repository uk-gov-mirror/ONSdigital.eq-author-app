import { flowRight, find, filter, flatMap, map, last } from "lodash";
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

    const currencyAnswersinPreviousSection = getAnswersofTypeFromSection(
      CURRENCY,
      previousSection
    );

    const percentageAnswersinPreviousSection = getAnswersofTypeFromSection(
      PERCENTAGE,
      previousSection
    );

    const numberAnswersinPreviousSection = getAnswersofTypeFromSection(
      NUMBER,
      previousSection
    );

    const allPreviousCurrencyAnswers = flatMap(previousSections, section =>
      flatMap(
        map(section.pages, page =>
          filter(page.answers, {
            type: "Currency",
          })
        )
      )
    );

    console.log(allPreviousCurrencyAnswers);

    return {
      page,
      previousSections,
      suggestions: {
        currentSection,
        previousSection,
        currencyAnswersinCurrentSection,
        numberAnswersinCurrentSection,
        percentageAnswersinCurrentSection,
        currencyAnswersinPreviousSection,
        percentageAnswersinPreviousSection,
        numberAnswersinPreviousSection,
      },
    };
  }

  // number answers in current section
  // currency answers in current section
  // percentage answers in current section

  // number answers in previous section
  // currency answers in previous section
  // percentage answers in previous section

  // all previous number answers
  // all previous currency answers
  // all previous percentage answers
  return {
    page,
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
