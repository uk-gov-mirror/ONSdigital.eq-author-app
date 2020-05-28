import styled from "styled-components";
import { colors } from "constants/theme";

import { UncontrolledInput } from "components/Forms/Input";

const maxListHeight = 6;

export const SearchInput = styled(UncontrolledInput)`
  padding: 0.5em;
  font-size: 1em;
  width: 100%;
  border: 1px solid ${colors.borders};
`;

export const SearchResults = styled.ul`
  list-style: none;
  margin: -1px 0 0;
  padding: 0;
  border: 1px solid ${colors.bordersLight};
  max-height: ${maxListHeight}em;
  overflow: scroll;
  position: absolute;
  width: 100%;
  z-index: 2;
  background: white;

  &:empty {
    display: none;
  }
`;

export const SearchResult = styled.li`
  display: flex;
  align-items: center;
  font-size: 0.85em;
  padding: 0.3em;
  height: 2em;
  cursor: pointer;
  background-color: ${props =>
    props.selected ? colors.lighterGrey : "transparent"};

  &:not(:last-of-type) {
    border-bottom: 1px solid ${colors.bordersLight};
  }
`;

export const SearchResultName = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

export const SearchResultEmail = styled.span`
  font-weight: normal;
`;

export const Highlight = styled.span`
  text-decoration: underline;
`;
