import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

import iconClose from "./icon-close.svg";

const Chip = styled.div`
  background: ${colors.primary};
  color: white;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.span`
  padding: 0.3em 0 0.3em 0.5em;
  line-height: 1em;
`;

const CloseButton = styled.button`
  content: "";
  display: inline-block;
  -webkit-appearance: none;
  border: none;
  background: url(${iconClose}) no-repeat center center;
  width: 1rem;
  height: 1rem;
  margin: 0 0.3em;
`;

const AnswerChip = ({ children, onRemove }) => (
  <Chip>
    <Title>{children}</Title>
    <CloseButton onClick={onRemove} />
  </Chip>
);

export default AnswerChip;
