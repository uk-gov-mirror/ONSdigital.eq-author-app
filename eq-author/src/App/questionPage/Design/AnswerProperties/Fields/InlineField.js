import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Field, Label } from "components/Forms";

const StyledInlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`;

const InlineField = ({ id, label, children, ...otherProps }) => (
  <StyledInlineField key={id} {...otherProps}>
    <Label bold={false} inline htmlFor={id}>
      {label}
    </Label>
    {children}
  </StyledInlineField>
);

InlineField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default InlineField;
