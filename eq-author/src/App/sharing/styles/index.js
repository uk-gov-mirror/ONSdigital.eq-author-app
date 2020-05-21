import styled from "styled-components";
import { colors } from "constants/theme";
import { UncontrolledInput } from "components/Forms/Input";
import Button from "components/buttons/Button";
import DescribedText from "components/DescribedText";

import iconLink from "./icon-link.svg";

export const Layout = styled.div`
  padding: 1.8em;
`;

export const PageTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 0.5em;
`;

export const Description = styled.p`
  margin: 0.1em 0 1em;
  font-size: 14px;
  font-weight: 400;
  color: ${colors.textLight};
`;

export const Described = styled.span`
  font-size: 0.9rem;
  margin-bottom: 1em;
`;

export const Section = styled.div`
  padding-top: 1.5em;
  &:first-of-type {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 1em;
`;

export const EditorTitle = styled(SectionTitle)`
  margin: 0;
`;

export const InsetText = styled.div`
  border-left: 10px solid #033e58;
  background: #eff0f9;
  padding: 1em;
`;

export const SearchContainer = styled.div`
  margin: 1em 0 2em;
  background: #ebeef0;
  height: 100%;
  padding: 1.5em 1.5em;
  display: flex;
  justify-content: space-between;
  width: 60%;
`;

export const SearchInput = styled(UncontrolledInput)`
  padding: 0.5em;
  font-size: 1em;
  width: 80%;
  border: 1px solid ${colors.borders};
`;

export const AddButton = styled(Button)``;

export const Separator = styled.span`
  border-left: 1px solid ${colors.blue};
  display: flex;
  align-items: center;
  margin-left: 15px;
  height: 22px;
`;

export const Wrapper = styled.div`
  display: flex;
`;

export const PublicLabel = styled.span`
  padding: 0 0.5em;
  &:first-of-type {
    padding-left: 1em;
  }
  font-weight: bold;
  font-size: 12px;
  color: ${props => (props.isActive ? colors.black : colors.grey)};
`;

export const ShareButton = styled(Button)`
  font-weight: bold;
  font-size: 0.8rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  padding: 0.6em;
  margin-bottom: 1.4em;
  border-radius: 0;
  color: ${colors.blue};
  background-color: ${colors.lighterGrey};

  &::before {
    content: "";
    background: url(${iconLink}) no-repeat center;
    display: inline-block;
    width: 1.3rem;
    height: 0.7rem;
    margin-right: 0.9em;
  }

  &:hover {
    background: ${colors.darkGrey};
    color: ${colors.white};
  }
`;
