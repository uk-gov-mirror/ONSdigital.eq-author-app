import styled from "styled-components";
import { colors } from "constants/theme";
import { UncontrolledInput } from "components/Forms/Input";
import Button from "components/buttons/Button";
import iconShare from "./icon-share.svg";

export const ShareLayout = styled.div`
  padding: 2em;
`;

export const PageTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 1em;
`;

export const SectionTitle = styled.h3`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 1em;
`;

export const PageDescription = styled.p`
  margin: 0.1em 0 1em;
  color: ${colors.textLight};
`;

export const PageSection = styled.div`
  padding: 2em 0;
  &:first-of-type {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
`;

export const SearchInput = styled(UncontrolledInput)`
  padding: 0.5em;
  font-size: 1em;
  width: 100%;
  border: 1px solid ${colors.borders};
`;

export const InsetText = styled.div`
  border-left: 10px solid #033e58;
  background: #eff0f9;
  padding: 1em;
`;

export const SearchContainer = styled.div`
  margin: 0 0 2em;
  background: #ebeef0;
  height: 100%;
  padding: 1em 1em 0.3em;
`;

export const Separator = styled.span`
  border-left: 1px solid ${colors.blue};
  display: flex;
  align-items: center;
  /* padding-left: 20px; */
  margin-left: 15px;
  height: 22px;
`;

export const Wrapper = styled.div`
  display: flex;
`;

export const ToggleLabel = styled.span`
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
    background: url(${iconShare}) no-repeat center;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin-right: 0.7em;
  }

  &:hover {
    background: ${colors.darkGrey};
    color: ${colors.white};
  }
`;
