import React from "react";
import {
  noop,
  isEmpty,
  flowRight,
  get,
  find,
  filter,
  flatMap,
  map,
  reduce,
} from "lodash";
import { Titled } from "react-titled";

import { withRouter } from "react-router";

import IconButtonDelete from "components/buttons/IconButtonDelete";

import Button from "components/buttons/Button";
import IconText from "components/IconText";
import DuplicateButton from "components/buttons/DuplicateButton";

import Loading from "components/Loading";
import Error from "components/Error";

import EditorLayout from "App/questionPage/Design/EditorLayout";

import { Label } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";

import AliasEditor from "components/AliasEditor";
import { Toolbar, Buttons } from "App/questionPage/Design/EditorToolbar";
import IconMove from "App/questionPage/Design/EditorToolbar/icon-move.svg?inline";
import { connect } from "react-redux";
import RichTextEditor from "components/RichTextEditor";
import styled from "styled-components";

import AnswerSelector from "./AnswerSelector";
import withQuestionnaire from "App/QuestionnairesPage/withQuestionnaire";
import {
  deleteSummaryPage,
  updateSummaryPage,
  addAnswer,
  addAnswers,
  removeAnswer,
} from "redux/summary";
import withFetchAnswers from "App/questionPage/Design/QuestionPageEditor/withFetchAnswers";

const titleControls = {
  emphasis: true,
  piping: true,
};

const Padding = styled.div`
  padding: 0 2em;
`;

export class CalculatedSummaryDesign extends React.Component {
  getPageTitle = page => title => {
    const pageTitle = page.displayName;
    return `${pageTitle} - ${title}`;
  };

  handleDelete = () => {
    this.props.deletePage(this.props.page.id);
  };

  renderContent = () => {
    const {
      loading,
      error,
      page,
      onChange,
      onUpdate,
      suggestions,
      addAnswer,
      addAnswers,
      removeAnswer,
    } = this.props;

    if (loading) {
      return <Loading height="38rem">Page loading…</Loading>;
    }

    if (error) {
      return <Error>Something went wrong</Error>;
    }

    if (isEmpty(page)) {
      return <Error>Something went wrong</Error>;
    }

    return (
      <Titled title={this.getPageTitle(page)}>
        <Toolbar>
          <VisuallyHidden>
            <Label htmlFor="alias">Short code (optional)</Label>
          </VisuallyHidden>
          <AliasEditor
            alias={page.alias}
            onUpdate={onUpdate}
            onChange={onChange}
          />
          <Buttons>
            <Button
              onClick={noop}
              data-test="btn-move"
              variant="tertiary"
              small
              disabled
            >
              <IconText icon={IconMove}>Move</IconText>
            </Button>
            <DuplicateButton
              onClick={noop}
              data-test="btn-duplicate-page"
              disabled
            >
              Duplicate
            </DuplicateButton>
            <IconButtonDelete
              onClick={this.handleDelete}
              data-test="btn-delete"
            >
              Delete
            </IconButtonDelete>
          </Buttons>
        </Toolbar>
        <div>
          <Padding>
            <RichTextEditor
              id="summary-title"
              name="title"
              label="Page title"
              placeholder="Title"
              value={page.title}
              onUpdate={onUpdate}
              controls={titleControls}
              size="large"
              fetchAnswers={withFetchAnswers}
              metadata={get(page, "section.questionnaire.metadata", [])}
              autoFocus={!page.title}
            />
            <div>
              <Label>Answers to calculate</Label>
              <AnswerSelector
                suggestions={suggestions}
                addAnswer={addAnswer}
                addAnswers={addAnswers}
                removeAnswer={removeAnswer}
                answers={page.answers}
              />
            </div>
            <RichTextEditor
              id="total-title"
              name="totalTitle"
              label="Total title"
              placeholder="Title"
              value={page.totalTitle}
              onUpdate={onUpdate}
              controls={titleControls}
              size="large"
              fetchAnswers={withFetchAnswers}
              metadata={get(page, "section.questionnaire.metadata", [])}
            />
          </Padding>
        </div>
      </Titled>
    );
  };

  render() {
    return (
      <EditorLayout onAddPage={noop} page={this.props.page} preview routing>
        {this.renderContent()}
      </EditorLayout>
    );
  }
}

const mapState = (state, ownProps) => {
  const { questionnaire } = ownProps;
  const { pageId, sectionId } = ownProps.match.params;

  const page = find(state.summary.pages, {
    id: pageId,
  });

  if (questionnaire) {
    const currentSection = find(questionnaire.sections, { id: sectionId });

    const currencyAnswersinCurrentSection = flatMap(
      map(currentSection.pages, page =>
        filter(page.answers, {
          type: "Currency",
        })
      )
    );

    const previousSection = reduce(
      questionnaire.sections,
      (previous, current, idx, sections) => {
        if (current.id === sectionId) {
          return previous;
        } else {
          return current;
        }
      }
    );

    const currencyAnswersinPreviousSection = flatMap(
      map(previousSection.pages, page =>
        filter(page.answers, {
          type: "Currency",
        })
      )
    );

    console.log(currencyAnswersinCurrentSection);
    console.log(currencyAnswersinPreviousSection);

    return {
      page,
      suggestions: {
        currentSection,
        currencyAnswersinCurrentSection,
        previousSection,
        currencyAnswersinPreviousSection,
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

  addAnswer: ({}) => {},
  addAnswers: answers =>
    dispatch(addAnswers({ pageId: ownProps.match.params.pageId, answers })),
  removeAnswer: answer =>
    dispatch(removeAnswer({ pageId: ownProps.match.params.pageId, answer })),
});

export default flowRight(
  withQuestionnaire,
  connect(
    mapState,
    mapDispatch
  ),
  withRouter,
  withFetchAnswers
)(CalculatedSummaryDesign);
