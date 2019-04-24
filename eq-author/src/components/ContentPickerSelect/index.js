import React, { Component } from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";
import { propType } from "graphql-anywhere";
import { isNil, isEmpty } from "lodash";

import ContentPickerModal from "components/ContentPickerModal";
import Button from "components/buttons/Button";
import Truncated from "components/Truncated";

import { colors } from "constants/theme";

import LogicalDestination from "graphql/fragments/logical-destination.graphql";
import QuestionPageDestination from "graphql/fragments/question-page-destination.graphql";
import SectionDestination from "graphql/fragments/section-destination.graphql";

import iconChevron from "components/ContentPickerSelect/icon-chevron.svg";
import Tooltip from "components/Forms/Tooltip";
import DeleteButton from "components/buttons/DeleteButton";

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const ClearButton = styled.button`
  margin-left: 1em;
`;

const Titles = styled.div`
  flex: 1 1 auto;
  overflow: hidden;
  margin-right: 0.5em;
`;

const ItemTitle = styled.span`
  margin-bottom: 0;
  font-size: 0.9em;
`;

const ItemSubtitle = styled.span`
  color: ${colors.grey};
  font-size: 0.8em;
`;

const ItemType = styled.span`
  font-size: 10px;
  background: #e4e8eb;
  padding: 0.3em 0.7em;
  border-radius: 1em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--colorTertiary);
  flex: 0 1 auto;
  align-self: center;
`;

export const ContentSelectButton = styled(Button).attrs({
  variant: "tertiary",
})`
  font-size: 1em;
  font-weight: normal;
  margin-right: 0.5em;
  padding: 0.5em 0.75em;
  border: 1px solid ${colors.borders};
  width: 100%;
  justify-content: space-between;

  &::after {
    content: url(${iconChevron});
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 2em;
    height: 2em;
    margin: auto;
    opacity: 0.7;
  }
  &:hover {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    background: none;
    color: ${colors.blue};
    &::after {
      opacity: 1;
    }
  }
`;

const ContentSelected = styled(Truncated)`
  color: ${colors.text};
  display: flex;
  padding-right: 1em;
  text-align: left;
  line-height: 1.3;
`;

export class UnwrappedContentPickerSelect extends Component {
  state = {
    isPickerOpen: false,
  };

  handlePickerOpen = () => {
    this.setState({
      isPickerOpen: true,
    });
  };

  handlePickerClose = () => {
    this.setState({
      isPickerOpen: false,
    });
  };

  handlePickerSubmit = selected => {
    this.handlePickerClose();
    this.props.onSubmit({ name: this.props.name, value: selected });
  };

  handlePickerClear = () => {
    this.props.onSubmit({ name: this.props.name, value: null });
  };

  render() {
    const { isPickerOpen } = this.state;
    const { selectedContent } = this.props;
    const {
      loading,
      error,
      disabled,
      answerData,
      questionData,
      metadataData,
      destinationData,
      selectedObj,
      hasClearButton,
      ...otherProps
    } = this.props;

    const noData =
      isEmpty(answerData) &&
      isEmpty(metadataData) &&
      isEmpty(destinationData) &&
      isEmpty(questionData);

    const isDisabled = loading || !isNil(error) || disabled || noData;

    return (
      <Flex>
        <ContentSelectButton
          data-test="content-picker-select"
          onClick={this.handlePickerOpen}
          disabled={isDisabled}
          {...otherProps}
        >
          <ContentSelected>
            <Titles>
              <ItemTitle>{selectedContent.title}</ItemTitle>
              {selectedContent.subTitle && (
                <ItemSubtitle>
                  <Truncated>{selectedContent.subTitle}</Truncated>
                </ItemSubtitle>
              )}
            </Titles>
            {selectedContent.type && (
              <ItemType>{selectedContent.type}</ItemType>
            )}
          </ContentSelected>
        </ContentSelectButton>
        {hasClearButton && (
          <Tooltip
            content="Clear selection"
            place="top"
            offset={{ bottom: 10 }}
          >
            <DeleteButton
              size="small"
              aria-label="Clear selection"
              onClick={this.handlePickerClear}
              disabled={!selectedObj}
            />
          </Tooltip>
        )}
        {isPickerOpen && (
          <ContentPickerModal
            isOpen
            onClose={this.handlePickerClose}
            onSubmit={this.handlePickerSubmit}
            data-test="picker"
            answerData={answerData}
            metadataData={metadataData}
            questionData={questionData}
            destinationData={destinationData}
            selectedObj={selectedObj}
          />
        )}
      </Flex>
    );
  }
}

UnwrappedContentPickerSelect.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object, // eslint-disable-line
  disabled: PropTypes.bool,
  data: PropTypes.shape({
    questionnaire: CustomPropTypes.questionnaire,
  }),
  selectedObj: PropTypes.shape({
    section: PropTypes.shape({
      id: PropTypes.string,
      displayName: PropTypes.string,
    }),
    page: PropTypes.shape({
      id: PropTypes.string,
      displayName: PropTypes.string,
    }),
    logical: PropTypes.string,
  }),
  selectedId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  selectedContent: PropTypes.shape({
    title: PropTypes.string,
    subTitle: PropTypes.string,
    type: PropTypes.string,
  }),
  name: PropTypes.string.isRequired,
  answerId: PropTypes.string,
  answerData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    })
  ),
  questionData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    })
  ),
  metadataData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    })
  ),
  destinationData: PropTypes.shape({
    logicalDestinations: PropTypes.arrayOf(propType(LogicalDestination)),
    questionPages: PropTypes.arrayOf(propType(QuestionPageDestination)),
    sections: PropTypes.arrayOf(propType(SectionDestination)),
  }),
};

UnwrappedContentPickerSelect.defaultProps = {
  selectedContent: { title: "Please select..." },
  hasClearButton: false,
};

export default UnwrappedContentPickerSelect;
