import React from "react";
import styled from "styled-components";
import Button from "components/buttons/Button";

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
