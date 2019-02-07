import React from "react";
import { noop, isEmpty, flowRight, get, find } from "lodash";
import { Titled } from "react-titled";
import gql from "graphql-tag";

import { withRouter } from "react-router";

import IconButtonDelete from "components/buttons/IconButtonDelete";

import Button from "components/buttons/Button";
import IconText from "components/IconText";
import DuplicateButton from "components/buttons/DuplicateButton";
import withPropRenamed from "enhancers/withPropRenamed";
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
import { deleteSummaryPage, updateSummaryPage } from "redux/summary";

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
              name="totalTitle"
              label="Total title"
              placeholder="Title"
              value={page.totalTitle}
              onUpdate={onUpdate}
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
  const { pageId } = ownProps.match.params;

  const page = find(state.summary.pages, {
    id: pageId,
  });

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
});

export default flowRight(
  connect(
    mapState,
    mapDispatch
  ),
  withRouter,
  withQuestionnaire
)(CalculatedSummaryDesign);
