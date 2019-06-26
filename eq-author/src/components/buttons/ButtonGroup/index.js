import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const VerticalGroup = css`
  flex-direction: column;

  > :not(:last-child) {
    margin-bottom: ${props => props.margin || "1.5em"};
  }
`;

const HorizontalGroup = css`
  flex-direction: row;

  > :not(:last-child) {
    margin-right: ${props => props.margin || "1em"};
  }
`;

const AlignRight = css`
  justify-content: flex-end;
`;

const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  ${props => props.vertical && VerticalGroup};
  ${props => props.horizontal && HorizontalGroup};
  ${props => props.align === "right" && AlignRight};
`;

const ButtonGroup = ({ children, ...otherProps }) => (
  <StyledButtonGroup {...otherProps}>{children}</StyledButtonGroup>
);

ButtonGroup.propTypes = {
  children: PropTypes.node,
  margin: PropTypes.string,
};

export default ButtonGroup;
