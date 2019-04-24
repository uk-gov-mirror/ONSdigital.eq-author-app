import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { xorBy, find } from "lodash";
import Modal, { CloseButton } from "components/modals/Modal";

import LogicalDestination from "graphql/fragments/logical-destination.graphql";
import QuestionPageDestination from "graphql/fragments/question-page-destination.graphql";
import SectionDestination from "graphql/fragments/section-destination.graphql";

import MultipleAnswerPicker from "./MultipleAnswerPicker";
import AnswerPicker from "./AnswerPicker";
import MetaDataPicker from "./MetaDataPicker";
import DestinationPicker from "./DestinationPicker";
import VariablePicker from "./VariablePicker";

import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";
import { colors } from "constants/theme";

const ModalFooter = styled.div`
  padding: 1.5em;
  border-top: 1px solid ${colors.bordersLight};
`;

export const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  right: 0.5em;
  top: ${props => (props.hasTabs ? "0" : "2em")};
  bottom: 0;
  margin: auto;
  align-items: center;
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    width: 45em;
  }
`;

const Container = styled.div`
  background: white;
`;

export const UNSELECTED = "UNSELECTED";

class ContentPickerModal extends React.Component {
  static propTypes = {
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
    questionData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
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
    destinationData: PropTypes.shape({
      logicalDestinations: PropTypes.arrayOf(propType(LogicalDestination)),
      questionPages: PropTypes.arrayOf(propType(QuestionPageDestination)),
      sections: PropTypes.arrayOf(propType(SectionDestination)),
    }),
    onSubmit: PropTypes.func,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    multiselect: PropTypes.bool,
  };

  static defaultProps = {
    multiselect: false,
  };

  state = {
    selectedItem: this.props.selectedObj,
    selectedItems: this.props.selectedObjs,
  };

  handleUnselected = () => {
    console.log("handleUnselected");

    this.setState({ selectedItem: UNSELECTED });
  };

  handleSelected = selectedItem => {
    const { selectedItems } = this.state;
    const { multiselect } = this.props;

    /* eslint-disable no-extra-boolean-cast */
    if (multiselect) {
      if (Boolean(find(selectedItems, { id: selectedItem.id }))) {
        this.setState({
          selectedItems: xorBy(selectedItems, [selectedItem], "id"),
        });
      } else {
        this.setState({
          selectedItems: [...selectedItems, selectedItem],
        });
      }
    } else {
      this.setState({ selectedItem });
    }
  };

  handleConfirm = () => {
    const { selectedItems, selectedItem } = this.state;
    const { onSubmit, multiselect } = this.props;

    if (multiselect) {
      onSubmit(selectedItems);
    } else {
      onSubmit(selectedItem);
    }
  };

  isSelected = item => {
    const { selectedItem } = this.state;
    return selectedItem && selectedItem.id === item.id;
  };

  renderPicker = () => {
    const {
      answerData,
      metadataData,
      destinationData,
      variableData,
      multiselect,
      ...otherProps
    } = this.props;

    const { selectedItem, selectedItems } = this.state;

    if (answerData) {
      return multiselect ? (
        <MultipleAnswerPicker
          onConfirm={this.handleConfirm}
          onSelected={this.handleSelected}
          onUnselected={this.handleUnselected}
          selectedItems={selectedItems}
          selectedItem={selectedItem}
          data={answerData}
          {...otherProps}
        />
      ) : (
        <AnswerPicker
          onConfirm={this.handleConfirm}
          onSelected={this.handleSelected}
          onUnselected={this.handleUnselected}
          isSelected={this.isSelected}
          selectedItem={selectedItem}
          data={answerData}
        />
      );
    } else if (metadataData) {
      return (
        <MetaDataPicker
          onConfirm={this.handleConfirm}
          onSelected={this.handleSelected}
          onUnselected={this.handleUnselected}
          isSelected={this.isSelected}
          selectedItem={selectedItem}
          data={metadataData}
        />
      );
    } else if (destinationData) {
      return (
        <DestinationPicker
          onConfirm={this.handleConfirm}
          onSelected={this.handleSelected}
          onUnselected={this.handleUnselected}
          isSelected={this.isSelected}
          selectedItem={selectedItem}
          data={destinationData}
        />
      );
    } else if (variableData) {
      return (
        <VariablePicker
          onConfirm={this.handleConfirm}
          onSelected={this.handleSelected}
          onUnselected={this.handleUnselected}
          isSelected={this.isSelected}
          selectedItem={selectedItem}
          data={variableData}
        />
      );
    }
  };

  render() {
    const { onClose, isOpen, onOpen } = this.props;

    return (
      <StyledModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        hasCloseButton
      >
        <Container>{this.renderPicker()}</Container>
        <ModalFooter>
          <ButtonGroup horizontal align="right">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              autoFocus
              onClick={this.handleConfirm}
              disabled={this.state.selectedItem === UNSELECTED}
            >
              Confirm
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </StyledModal>
    );
  }
}

export default ContentPickerModal;
