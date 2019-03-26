import React from "react";

import styled, { keyframes } from "styled-components";
import IconText from "./IconText";
import ExpansionTransition from "./transitions/ExpansionTransition";
import { colors } from "constants/theme";
import WarningIcon from "components/OfflineBanner/icon-warning.svg?inline";
import { TransitionGroup } from "react-transition-group";

import PermissionsContext from "App/QuestionnaireDesignPage/PermissionsContext";

const Banner = styled.div`
  background-color: ${colors.red};
  height: 2.5em;
  justify-content: center;
  display: flex;
`;

const StyledExpansionTransition = styled(ExpansionTransition)`
  &.expansion-exit,
  &.expansion-exit.expansion-exit-active {
    > :first-child {
      visibility: hidden;
    }
  }
`;

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const WarningMessage = styled(IconText)`
  align-items: center;
  display: flex;
  color: ${colors.white};
  animation: ${fade} 750ms ease-in forwards;
  padding: 1em;
`;

export const PermissionsBanner = props => {
  return (
    <PermissionsContext.Consumer>
      {({ userCanEdit }) => (
        <TransitionGroup>
          {!userCanEdit && (
            <StyledExpansionTransition finalHeight="3.5em">
              <Banner>
                <WarningMessage icon={WarningIcon}>
                  You do not have editor access to this questionnaire, any
                  changes you make will not be saved
                </WarningMessage>
              </Banner>
            </StyledExpansionTransition>
          )}
        </TransitionGroup>
      )}
    </PermissionsContext.Consumer>
  );
};

export default PermissionsBanner;
