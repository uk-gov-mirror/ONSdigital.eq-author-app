import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";
import { buildQuestionnairePath } from "utils/UrlUtils";
import { colors } from "constants/theme";
import CustomPropTypes from "custom-prop-types";

const StyledLink = styled(NavLink)`
  text-decoration: none;
  color: ${colors.blue};
  padding: 0 0.5em;
  display: flex;
  flex-direction: column;
  margin-left: -0.5em;

  &:focus {
    outline: none;
  }

  ${props =>
    props.disabled &&
    css`
      text-decoration: none;
      color: ${colors.text};
    `};
`;

const QuestionnaireLink = ({ questionnaire, disabled, ...otherProps }) => {
  return (
    <StyledLink
      {...otherProps}
      disabled={disabled}
      to={buildQuestionnairePath({
        questionnaireId: questionnaire.id,
      })}
    />
  );
};

QuestionnaireLink.defaultProps = {
  disabled: false,
};

QuestionnaireLink.propTypes = {
  questionnaire: CustomPropTypes.questionnaire,
  disabled: PropTypes.bool,
};

export default QuestionnaireLink;
