import React from "react";
import { noop, isEmpty, flowRight, get, find } from "lodash";
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

  renderContent = () => {
    const { loading, error, page, onChange, onUpdate } = this.props;

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
            <Label htmlFor="alias">Question short code (optional)</Label>
          </VisuallyHidden>
          <AliasEditor alias={""} onUpdate={noop} onChange={noop} />
          <Buttons>
            <Button
              onClick={noop}
              data-test="btn-move"
              variant="tertiary"
              small
            >
              <IconText icon={IconMove}>Move</IconText>
            </Button>
            <DuplicateButton onClick={noop} data-test="btn-duplicate-page">
              Duplicate
            </DuplicateButton>
            <IconButtonDelete onClick={noop} data-test="btn-delete">
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
              onUpdate={noop}
              controls={titleControls}
              size="large"
              fetchAnswers={noop}
              metadata={get(page, "section.questionnaire.metadata", [])}
              autoFocus={!page.title}
            />
            <div>
              <Label>Answers to calculate</Label>

              <AnswerSelector answers={page.answers} />
            </div>
            <RichTextEditor
              id="total-title"
              name="title"
              label="Total title"
              placeholder="Title"
              value={page.totalTitle}
              onUpdate={noop}
              controls={titleControls}
              size="large"
              fetchAnswers={noop}
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
  const { questionnaireId, sectionId, pageId } = ownProps.match.params;

  const questionnaire = find(state.summary.questionnaires, {
    id: questionnaireId,
  });
  const section = find(questionnaire.sections, { id: sectionId });
  const page = find(section.pages, { id: pageId });

  return {
    page,
  };
};

const mapDispatch = () => ({});

export default flowRight(
  withRouter,
  withQuestionnaire,
  connect(
    mapState,
    mapDispatch
  )
)(CalculatedSummaryDesign);
