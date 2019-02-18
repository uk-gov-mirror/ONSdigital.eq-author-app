import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import Truncated from "components/Truncated";
import iconClose from "./icon-close.svg";

const Chip = styled.div`
  background: ${colors.primary};
  color: white;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
`;

const Title = styled(Truncated)`
  padding: 0.3em 0 0.3em 0.5em;
  line-height: 1.3;
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

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 1px ${colors.tertiary};
  }
`;

const AnswerChip = ({ children, onRemove }) => (
  <Chip>
    <Title>{children}</Title>
    <CloseButton onClick={onRemove} />
  </Chip>
);

export default AnswerChip;
