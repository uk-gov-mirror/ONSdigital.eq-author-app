import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import Popout, { Container, Layer } from "components/Popout";
import IconText from "components/IconText";
import Button from "components/buttons/Button";

import AddIcon from "./icon-add.svg?inline";
import PopupTransition from "./PopupTransition";
import AnswerTypeGrid from "./AnswerTypeGrid";

import ErrorInline from "components/ErrorInline";
import { colors } from "constants/theme";

const AddAnswerButton = styled(Button)`
  width: 100%;
  padding: 0.5em;
`;

const PopoutContainer = styled(Container)`
  width: 100%;
`;

const PopoutLayer = styled(Layer)`
  width: 22em;
  right: 0;
  left: 0;
  bottom: 3.5em;
  margin: 0 auto;
  z-index: 10;
`;

const ErrorContext = styled.div`
  position: relative;
  margin-bottom: 1em;

  ${props =>
    props.invalid &&
    css`
      border: 1px solid ${colors.red};
      padding: 1em;
    `}
`;

export default class AnswerTypeSelector extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    answerCount: PropTypes.number.isRequired,
  };

  state = {
    open: false,
  };

  handleOpenToggle = open => {
    this.setState({ open });
  };

  handleSelect = type => {
    this.props.onSelect(type);
  };

  handleEntered = () => {
    this.grid.focusMenuItem();
  };

  saveGridRef = grid => {
    this.grid = grid;
  };

  render() {
    const { invalid } = this.props;

    const trigger = (
      <AddAnswerButton variant="secondary" data-test="btn-add-answer" invalid>
        <IconText icon={AddIcon}>
          Add {this.props.answerCount === 0 ? "an" : "another"} answer
        </IconText>
      </AddAnswerButton>
    );

    return (
      <ErrorContext invalid={invalid}>
        <Popout
          open={this.state.open}
          transition={PopupTransition}
          trigger={trigger}
          container={PopoutContainer}
          layer={PopoutLayer}
          onToggleOpen={this.handleOpenToggle}
          onEntered={this.handleEntered}
        >
          <AnswerTypeGrid onSelect={this.handleSelect} ref={this.saveGridRef} />
        </Popout>
        {invalid && <ErrorInline>Answer required</ErrorInline>}
      </ErrorContext>
    );
  }
}
