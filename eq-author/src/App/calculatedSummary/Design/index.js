import React from "react";
import { noop, isEmpty, flowRight, get } from "lodash";
import { Titled } from "react-titled";

import { withRouter } from "react-router";
import withSummary from "./../withSummary";

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

import RichTextEditor from "components/RichTextEditor";
import styled from "styled-components";

import AnswerSelector from "./AnswerSelector";

import withFetchAnswers from "App/questionPage/Design/QuestionPageEditor/withFetchAnswers";

const titleControls = {
  emphasis: true,
  piping: true
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
      ...otherProps
    } = this.props;

    if (loading) {
      return <Loading height="38rem">Page loading…</Loading>;
    }

    if (error) {
      return <Error>Something went wrong 12</Error>;
    }

    if (isEmpty(page)) {
      return <Error>Something went wrong 12</Error>;
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
              placeholder="eg. We calculate the answer as [total], are you sure this is correct?"
              value={page.title}
              onUpdate={onUpdate}
              controls={titleControls}
              size="large"
              fetchAnswers={withFetchAnswers}
              metadata={get(page, "section.questionnaire.metadata", [])}
              autoFocus={!page.title}
              variableData={[
                {
                  id: "1",
                  displayName: "Total",
                  __typename: "Variable"
                }
              ]}
            />
            <div>
              <Label>Answers to calculate</Label>
              <AnswerSelector answers={page.answers} {...otherProps} />
            </div>
            <RichTextEditor
              id="total-title"
              name="totalTitle"
              label="Total title"
              placeholder="eg. Total value of answers"
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

export default flowRight(
  withRouter,
  withSummary
)(CalculatedSummaryDesign);
