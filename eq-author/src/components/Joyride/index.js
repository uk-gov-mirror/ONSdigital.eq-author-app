import React from "react";
import styled from "styled-components";
import Button from "components/buttons/Button";

import header from "./header.png";
import { colors } from "constants/theme";

export const Heading = styled.h1`
  margin: 0;
  text-align: center;
`;

export const SubHeading = styled.h3`
  text-align: center;

  a {
    color: inherit;
    text-decoration: underline;
  }
`;

export const TooltipBody = styled.div`
  background-color: #fff;
  color: #666;
  min-width: 290px;
  max-width: 420px;
  position: relative;
`;

export const TooltipContent = styled.div`
  padding: 1em;
`;

export const TooltipTitle = styled.h2`
  font-size: 1.1em;
  padding: 1em;
  margin: 0;
`;

export const TooltipFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding: 5px;
  * + * {
    margin-left: 0.5rem;
  }
`;

export const Tooltip = ({
  continuous,
  index,
  isLastStep,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  ref,
}) => {
  return (
    <div {...tooltipProps}>
      <TooltipBody>
        {step.title && <TooltipTitle>{step.title}</TooltipTitle>}
        {step.content && <TooltipContent>{step.content}</TooltipContent>}
        <TooltipFooter>
          {!isLastStep && (
            <Button {...skipProps} small>
              Skip
            </Button>
          )}
          {index > 0 && <Button {...backProps}>Back</Button>}
          <Button {...primaryProps}>{continuous ? "next" : "close"}</Button>
        </TooltipFooter>
      </TooltipBody>
    </div>
  );
};

const Welcome = styled.div`
  width: 627px;
  background: white;
  text-align: center;
  padding: 3em 0 2.5em;
  margin-top: -100px;
`;

const WelcomeHeader = styled.div`
  background: url(${header}) no-repeat top center;
  background-size: 100%;
  height: 108px;
  margin-bottom: 2em;
`;

const WelcomeTitle = styled.h2`
  font-size: 1.4em;
  font-weight: 600;
`;

const WelcomeText = styled.div`
  color: #4a4a4a;
  max-width: 32em;
  margin: 0 auto 2em;
`;

const PrimaryButton = styled(Button)`
  margin-bottom: 1em;
`;

const SecondaryButton = styled.button`
  appearance: none;
  border: none;
  background-color: transparent;
  font-size: 1em;
  padding: 0.25em 0.5em;
  color: ${colors.primary};
  font-weight: bold;
  &:focus {
    outline: 3px solid ${colors.orange};
  }
`;

export const WelcomeModal = ({
  continuous,
  index,
  isLastStep,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  ref,
}) => (
  <div {...tooltipProps}>
    <Welcome>
      <WelcomeHeader />
      <WelcomeTitle>Welcome to eQ Author</WelcomeTitle>
      <WelcomeText>
        <p>
          Curabitur blandit tempus porttitor. Nullam id dolor id nibh ultricies
          vehicula ut id elit. Nullam quis risus eget urna mollis ornare vel eu
          leo.
        </p>
      </WelcomeText>
      <PrimaryButton variant="primary">Take the tour</PrimaryButton>
      <br />
      <SecondaryButton>Skip the tour</SecondaryButton>
    </Welcome>
  </div>
);
