import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import SidebarButton, {
  Title,
  Detail
} from "components/buttons/SidebarButton/index.js";

import ModalDialog from "components/modals/ModalDialog";
import MinValueValidation from "./TotalMinValue";

import ValidationContext from "./ValidationContext";
import { gotoTab } from "redux/tabs/actions";

import { get } from "lodash";
import Button from "components/buttons/Button";

import IconTotal from "./icon-calculator.svg?inline";

import { updateValidation, getValidation } from "redux/validation";

const ValidationModalDialog = styled(ModalDialog)`
  .Modal {
    width: 40em;
    height: 23em;
  }
`;

const Container = styled.div`
  padding: 0.25em 0 0;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TotalButton = styled(SidebarButton)`
  display: flex;
  align-items: center;
  padding-right: 2em;
`;

const Icon = styled(IconTotal)`
  flex: 0 0 auto;
`;

const Details = styled.div`
  margin-left: 0.1em;
  flex: 1 1 auto;
`;

const DetailsValue = styled.span`
  padding-right: 1em;
`;

const preview = ({ custom, previousAnswer }) =>
  custom ? custom : get(previousAnswer, "displayName");

class TotalValidation extends React.Component {
  constructor(props) {
    super(props);
    this.modalId = `modal-validation-total`;

    this.state = {
      modalIsOpen: false
    };
  }

  handleModalDialogClose = () => this.setState({ modalIsOpen: false });

  handleUpdateAnswerValidation = ({ validation }) => {
    this.props.updateValidation({ pageId: this.props.pageId, validation });
  };

  handleToggleValidationRule = () => {
    console.log("handleToggleValidationRule");
  };

  render() {
    const comparator = get(this.props.validation, "comparator");
    const enabled = get(this.props.validation, "enabled");

    const answer = {
      id: this.props.answers[0].id,
      validation: {
        minValue: this.props.validation
      }
    };

    const value = enabled ? preview(this.props.validation) : "";

    return (
      <Container>
        <ValidationContext.Provider
          value={{
            answer,
            onUpdateAnswerValidation: this.handleUpdateAnswerValidation
          }}
        >
          <TotalButton
            onClick={() => {
              this.setState({ modalIsOpen: true });
            }}
          >
            <Icon />
            <Details>
              <Title>Total {value && comparator.toLowerCase()}</Title>
              {value && (
                <Detail>
                  <DetailsValue>{value}</DetailsValue>
                </Detail>
              )}
            </Details>
          </TotalButton>

          <ValidationModalDialog
            id={this.modalId}
            onClose={this.handleModalDialogClose}
            title="Total validation"
            isOpen={this.state.modalIsOpen}
          >
            <MinValueValidation
              answerId={answer.id}
              onUpdateAnswerValidation={this.handleUpdateAnswerValidation}
              onToggleValidationRule={this.handleToggleValidationRule}
            />

            <Buttons>
              <Button onClick={this.handleModalDialogClose} variant="primary">
                Done
              </Button>
            </Buttons>
          </ValidationModalDialog>
        </ValidationContext.Provider>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  tabsState: state.tabs,
  validation: getValidation(
    state.validation,
    ownProps.pageId,
    ownProps.answers[0].id
  )
});

export default connect(
  mapStateToProps,
  { gotoTab, updateValidation }
)(TotalValidation);
