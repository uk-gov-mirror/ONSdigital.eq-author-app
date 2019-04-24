import React from "react";

import styled, { css } from "styled-components";
import IconAnswers from "./icon-answers.svg?inline";
import IconSections from "./icon-sections.svg?inline";
import { colors } from "constants/theme";

export const OPTION_ANSWERS = "option-answers";
export const OPTION_SECTIONS = "option-sections";

const Options = styled.div`
  list-style: none;
  padding: 0;
  margin: 0;
  color: ${colors.textLight};
  display: flex;
  align-items: center;
  font-size: 0.9em;
`;

const OptionsLabel = styled.div`
  margin-right: 1em;
`;

const OptionInput = styled.input`
  display: none;
`;

const optionChecked = css`
  color: white;
  background: ${colors.primary};
  border-color: #2d5e7a;
  z-index: 1;
  &:hover {
    background: ${colors.secondary};
  }
  path {
    fill: white;
  }
`;

const OptionLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  background: white;
  padding: 0.5rem 1rem;
  font-size: 0.9em;
  font-weight: bold;
  border: 1px solid ${colors.bordersLight};
  flex: 0 0 auto;
  text-align: center;
  position: relative;
  white-space: nowrap;

  &:first-of-type {
    border-radius: 4px 0 0 4px;
    margin-right: -1px;
  }

  &:last-of-type {
    border-radius: 0 4px 4px 0;
  }

  &:hover {
    background: ${colors.lightMediumGrey};
  }

  &:focus-within {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }

  &:not(:last-of-type) {
    /* margin-right: 1em; */
  }

  ${props => props.checked && optionChecked};
`;

const OptionLabelText = styled.div`
  margin-left: 0.3em;
  line-height: 1.3;
`;

const Option = ({ id, option, children, icon: Icon, ...otherProps }) => (
  <OptionLabel checked={option === id}>
    <Icon />
    <OptionLabelText>{children}</OptionLabelText>
    <OptionInput
      type="radio"
      name="options"
      value={id}
      checked={option === id}
      {...otherProps}
    />
  </OptionLabel>
);

export default ({ option, onChange }) => (
  <Options>
    <OptionsLabel>Browse by</OptionsLabel>
    <Option
      id={OPTION_SECTIONS}
      option={option}
      icon={IconSections}
      onChange={onChange}
    >
      Sections
    </Option>
    <Option
      id={OPTION_ANSWERS}
      option={option}
      icon={IconAnswers}
      onChange={onChange}
    >
      Answers
    </Option>
  </Options>
);
