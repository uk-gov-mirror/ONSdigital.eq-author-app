import styled from "styled-components";
import { colors } from "constants/theme";

import iconClose from "./icons/icon-close.svg";

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  color: ${colors.text};
  max-height: 10em;
`;

export const ListItem = styled.li`
  margin: 0 0 0.1em;
  padding: 0.3em 0;
  display: flex;
  align-items: center;
  position: relative;
  color: #666;
`;

export const UserName = styled.div`
  font-weight: bold;
  font-size: 0.9em;
`;

export const UserEmail = styled.div`
  font-size: 0.9em;
  margin-left: 0.5em;
  opacity: 0.7;
`;

export const UserIcon = styled.img`
  margin-right: 0.25em;
  height: 1.1em;
`;

export const RemoveButton = styled.button`
  appearance: none;
  width: 1.5em;
  height: 1.5em;
  background: url(${iconClose}) no-repeat center;
  background-size: 100%;
  position: absolute;
  right: 0.3em;
  border: none;
  padding: 0;
  font-size: 1rem;
  opacity: 0.5;
  &:focus {
    outline: 2px solid ${colors.tertiary};
  }
  &:hover {
    cursor: pointer;
  }
`;

export const UserOwner = styled.span`
  position: absolute;
  right: 0.5em;
  font-size: 0.9em;
  font-weight: bold;
  opacity: 0.7;
`;
