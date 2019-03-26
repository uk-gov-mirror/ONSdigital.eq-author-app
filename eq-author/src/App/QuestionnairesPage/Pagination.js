import React from "react";
import Button from "components/buttons/Button";
import styled from "styled-components";
import iconArrow from "./icon-arrow.svg";
import VisuallyHidden from "components/VisuallyHidden";
import { colors } from "constants/theme";
import { clamp } from "lodash";

const PaginationButton = styled(Button).attrs({ variant: "secondary" })`
  font-size: 0.8em;
  padding: 0.6em 1.4em;
  border: 1px solid ${colors.bordersLight};
  margin: 0;

  &::before {
    content: "";
    width: 1em;
    height: 1em;
    display: block;
    background: url(${iconArrow}) no-repeat center;
  }

  &[disabled] {
    opacity: 1;
    &::before {
      opacity: 0.5;
    }
  }

  &:hover {
    background: ${colors.lighterGrey};
    border-color: ${colors.borders};
  }
`;

const PrevButton = styled(PaginationButton)`
  border-radius: 4px 0 0 4px;
`;

const NextButton = styled(PaginationButton)`
  border-radius: 0 4px 4px 0;
  &::before {
    transform: scaleX(-1);
  }
`;

const Pages = styled.div`
  background: white;
  border: 1px solid ${colors.bordersLight};
  border-left: none;
  border-right: none;
  line-height: 1;
  font-size: 0.9em;
  padding: 0 1.5em;
  display: flex;
  align-items: center;
  color: #666;
`;

const Buttons = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const Pagination = ({
  pages,
  hasNextPage,
  hasPreviousPage,
  previousPage,
  nextPage,
  totalPages,
  getPageItemProps,
  currentPage,
  onPageChange,
}) => {
  return (
    <Buttons>
      <PrevButton
        disabled={!hasPreviousPage}
        {...getPageItemProps({
          pageValue: previousPage,
          onPageChange,
        })}
      >
        <VisuallyHidden>previous</VisuallyHidden>
      </PrevButton>

      <Pages>
        {clamp(currentPage, 1, totalPages)} of {totalPages || 1}
      </Pages>

      <NextButton
        disabled={!hasNextPage}
        {...getPageItemProps({
          pageValue: nextPage,
          onPageChange,
        })}
      >
        <VisuallyHidden>next</VisuallyHidden>
      </NextButton>
    </Buttons>
  );
};

export default Pagination;
