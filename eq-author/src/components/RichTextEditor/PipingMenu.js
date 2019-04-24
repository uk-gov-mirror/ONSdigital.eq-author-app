import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { isEmpty } from "lodash";

import ContentPickerModal from "components/ContentPickerModal";
import AvailablePipingContentQuery from "components/RichTextEditor/AvailablePipingContentQuery";
import shapeTree from "components/ContentPicker/shapeTree";

import CustomPropTypes from "custom-prop-types";

import IconPipeAnswer from "components/RichTextEditor/icon-pipe-answer.svg?inline";
import IconPipeMetadata from "components/RichTextEditor/icon-pipe-metadata.svg?inline";
import IconPipeVariable from "components/RichTextEditor/icon-pipe-variable.svg?inline";

import ToolbarButton from "components/RichTextEditor/ToolbarButton";

const ANSWER = "ANSWER";
const METADATA = "METADATA";
const VARIABLE = "VARIABLE";

const PipingIconButton = ({ children, ...props }) => (
  <ToolbarButton {...props}>{children}</ToolbarButton>
);

export const MenuButton = styled(PipingIconButton)`
  height: 100%;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
`;

export class Menu extends React.Component {
  static propTypes = {
    onItemChosen: PropTypes.func.isRequired,
    match: CustomPropTypes.match,
    disabled: PropTypes.bool,
    canFocus: PropTypes.bool,
    loading: PropTypes.bool,
    allowableTypes: PropTypes.arrayOf(PropTypes.string),
    answerData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
    metadataData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
    defaultTab: PropTypes.string,
  };

  state = {
    isAnswerPickerOpen: false,
  };

  handlePickerClose = () => {
    this.setState({
      pickerOpen: false,
    });
  };

  handlePickerSubmit = (...args) => {
    this.handlePickerClose();
    this.props.onItemChosen(...args);
  };

  render() {
    const {
      answerData,
      metadataData,
      variableData,
      disabled,
      loading,
      canFocus,
    } = this.props;

    const { pickerOpen } = this.state;

    return (
      <React.Fragment>
        <MenuButton
          title="Pipe answer"
          disabled={loading || disabled || isEmpty(answerData)}
          onClick={() => this.setState({ pickerOpen: ANSWER })}
          canFocus={canFocus}
        >
          <IconPipeAnswer />
        </MenuButton>
        {pickerOpen === ANSWER && (
          <ContentPickerModal
            isOpen={pickerOpen === ANSWER}
            answerData={answerData}
            onClose={this.handlePickerClose}
            onSubmit={this.handlePickerSubmit}
          />
        )}
        <MenuButton
          title="Pipe metadata"
          onClick={() => this.setState({ pickerOpen: METADATA })}
          disabled={loading || disabled || isEmpty(metadataData)}
          canFocus={canFocus}
        >
          <IconPipeMetadata />
        </MenuButton>
        {pickerOpen === METADATA && (
          <ContentPickerModal
            isOpen={pickerOpen === METADATA}
            metadataData={metadataData}
            onClose={this.handlePickerClose}
            onSubmit={this.handlePickerSubmit}
          />
        )}
        <MenuButton
          title="Pipe variable"
          onClick={() => this.setState({ pickerOpen: VARIABLE })}
          disabled={loading || disabled || isEmpty(metadataData)}
          canFocus={canFocus}
        >
          <IconPipeVariable />
        </MenuButton>
        {pickerOpen === VARIABLE && (
          <ContentPickerModal
            isOpen={pickerOpen === VARIABLE}
            variableData={[
              {
                id: "1",
                displayName: "Total",
                type: "Sum",
                description: "The sum of the answers chosen on this page",
                __typename: "Variable",
              },
            ]}
            onClose={this.handlePickerClose}
            onSubmit={this.handlePickerSubmit}
          />
        )}
      </React.Fragment>
    );
  }
}

const calculateEntityName = ({
  sectionId,
  pageId,
  confirmationId,
  introductionId,
}) => {
  if (confirmationId) {
    return "questionConfirmation";
  }
  if (pageId) {
    return "page";
  }
  if (sectionId) {
    return "section";
  }
  if (introductionId) {
    return "questionnaireIntroduction";
  }
};

const postProcessPipingContent = entity => {
  if (!entity) {
    return false;
  }

  const processedAnswers = [];

  entity.availablePipingAnswers.forEach(answer => {
    if (answer.type === "DateRange") {
      processedAnswers.push({
        ...answer,
        id: `${answer.id}from`,
      });

      processedAnswers.push({
        ...answer,
        id: `${answer.id}to`,
        displayName: answer.secondaryLabel || answer.secondaryLabelDefault,
      });
    } else {
      processedAnswers.push(answer);
    }
  });

  return {
    ...entity,
    availablePipingAnswers: processedAnswers,
  };
};

export const UnwrappedPipingMenu = props => {
  return (
    <AvailablePipingContentQuery
      questionnaireId={props.match.params.questionnaireId}
      pageId={props.match.params.pageId}
      sectionId={props.match.params.sectionId}
      confirmationId={props.match.params.confirmationId}
      introductionId={props.match.params.introductionId}
    >
      {({ data = {}, ...innerProps }) => {
        const entityName = calculateEntityName(props.match.params);
        const entity = postProcessPipingContent(data[entityName]) || {};

        return (
          <Menu
            answerData={shapeTree(entity.availablePipingAnswers)}
            metadataData={entity.availablePipingMetadata}
            entity={entity}
            entityName={entityName}
            {...props}
            {...innerProps}
          />
        );
      }}
    </AvailablePipingContentQuery>
  );
};

UnwrappedPipingMenu.propTypes = {
  match: CustomPropTypes.match,
  canFocus: PropTypes.bool,
};

export default withRouter(UnwrappedPipingMenu);
