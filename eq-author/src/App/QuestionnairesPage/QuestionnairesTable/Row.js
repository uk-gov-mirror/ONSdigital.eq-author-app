import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import CustomPropTypes from "custom-prop-types";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DuplicateButton from "components/buttons/DuplicateButton";
import Truncated from "components/Truncated";

import { colors } from "constants/theme";

import QuestionnaireLink from "App/QuestionnairesPage/QuestionnaireLink";
import FormattedDate from "App/QuestionnairesPage/FormattedDate";
import FadeTransition from "components/transitions/FadeTransition";
import { partial } from "lodash";
import { rgba } from "polished";

const TruncatedQuestionnaireLink = Truncated.withComponent(QuestionnaireLink);
TruncatedQuestionnaireLink.displayName = "TruncatedQuestionnaireLink";

const TR = styled.tr`
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background-color: ${props =>
    props.odd ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.02)"};
  opacity: 1;
  color: ${props => (props.disabled ? `${colors.textLight}` : "inherit")};
  height: 3.2em;
  position: relative;

  ${props =>
    props.linkHasFocus &&
    css`
      box-shadow: 0 0 0 3px ${colors.tertiary};
      border-color: ${colors.tertiary};
    `}

  &:hover {
    background-color: ${rgba(colors.primary, 0.1)};
    cursor: pointer;
  }
`;

const TD = styled.td`
  line-height: 1.3;
  padding: 0 1em;
  text-align: ${props => props.textAlign};
  font-size: 0.9em;
`;

TD.propTypes = {
  textAlign: PropTypes.oneOf(["left", "center", "right"]),
};

TD.defaultProps = {
  textAlign: "left",
};

const ButtonGroup = styled.div`
  display: flex;
`;

const Shortcode = styled.span`
  color: ${colors.textLight};
  text-decoration-color: ${colors.textLight};
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

class Row extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire.isRequired,
    onDeleteQuestionnaire: PropTypes.func.isRequired,
    onDuplicateQuestionnaire: PropTypes.func.isRequired,
    in: PropTypes.bool,
    exit: PropTypes.bool,
    enter: PropTypes.bool,
    autoFocus: PropTypes.bool,
    odd: PropTypes.bool,
  };

  rowRef = React.createRef();

  handleOpenDeleteQuestionnaireDialog = () => {
    this.props.onDeleteQuestionnaire(this.props.questionnaire);
  };

  handleDuplicateQuestionnaire = () => {
    this.props.onDuplicateQuestionnaire(this.props.questionnaire);
  };

  isQuestionnaireADuplicate() {
    return this.props.questionnaire.id.startsWith("dupe");
  }

  shouldComponentUpdate(nextProps) {
    for (let key of Object.keys(Row.propTypes)) {
      if (this.props[key] !== nextProps[key]) {
        return true;
      }
    }
    return false;
  }

  focusLink() {
    this.rowRef.current.getElementsByTagName("a")[0].focus();
  }

  componentDidMount() {
    if (this.isQuestionnaireADuplicate() || this.props.autoFocus) {
      this.focusLink();
    }
  }

  componentDidUpdate() {
    if (this.props.autoFocus) {
      this.focusLink();
    }
  }
  render() {
    const { questionnaire, onDeleteQuestionnaire, odd, ...rest } = this.props;

    return (
      <TR
        innerRef={this.rowRef}
        odd={odd}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        {...rest}
      >
        <TD onClick={this.handleClick}>
          <QuestionnaireLink
            data-test="anchor-questionnaire-title"
            questionnaire={questionnaire}
            title={questionnaire.title}
          >
            {questionnaire.shortTitle && (
              <Shortcode>{questionnaire.shortTitle}</Shortcode>
            )}
            <Truncated>{questionnaire.title}</Truncated>
          </QuestionnaireLink>
        </TD>
        <TD onClick={this.handleClick}>
          <FormattedDate date={questionnaire.createdAt} />
        </TD>
        <TD onClick={this.handleClick}>
          <FormattedDate date={questionnaire.createdAt} />
        </TD>
        <TD>
          <div ref={this.buttonsRef}>
            <ButtonGroup>
              <DuplicateButton
                data-test="btn-duplicate-questionnaire"
                onClick={this.handleDuplicateQuestionnaire}
                style={{ marginRight: "0.5em" }}
              />
              <IconButtonDelete
                hideText
                data-test="btn-delete-questionnaire"
                onClick={partial(onDeleteQuestionnaire, questionnaire.id)}
              />
            </ButtonGroup>
          </div>
        </TD>
      </TR>
    );
  }

  renderx() {
    const { questionnaire, ...rest } = this.props;
    const isOptimisticDupe = this.isQuestionnaireADuplicate();

    return (
      <FadeTransition
        {...rest}
        enter={isOptimisticDupe}
        exit={!isOptimisticDupe}
      >
        <TR innerRef={this.rowRef} disabled={isOptimisticDupe}>
          <TD>
            <TruncatedQuestionnaireLink
              data-test="anchor-questionnaire-title"
              questionnaire={questionnaire}
              title={questionnaire.displayName}
              disabled={isOptimisticDupe}
            >
              {questionnaire.displayName}
            </TruncatedQuestionnaireLink>
          </TD>
          <TD>
            <FormattedDate date={questionnaire.createdAt} />
          </TD>
          <TD>
            <Truncated>{questionnaire.createdBy.name || "Unknown"}</Truncated>
          </TD>
          <TD textAlign="center">
            <ButtonGroup>
              <DuplicateButton
                data-test="btn-duplicate-questionnaire"
                onClick={this.handleDuplicateQuestionnaire}
                disabled={isOptimisticDupe}
              />
              <IconButtonDelete
                hideText
                data-test="btn-delete-questionnaire"
                onClick={this.handleOpenDeleteQuestionnaireDialog}
                disabled={isOptimisticDupe}
              />
            </ButtonGroup>
          </TD>
        </TR>
      </FadeTransition>
    );
  }
}

export default Row;
