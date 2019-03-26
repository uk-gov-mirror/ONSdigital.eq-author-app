import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { withRouter } from "react-router-dom";

import CustomPropTypes from "custom-prop-types";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DuplicateButton from "components/buttons/DuplicateButton";
import Truncated from "components/Truncated";

import { colors } from "constants/theme";

import QuestionnaireLink from "App/QuestionnairesPage/QuestionnaireLink";
import FormattedDate from "App/QuestionnairesPage/FormattedDate";

import { partial } from "lodash";

import guestAvatar from "App/UserProfile/icon-guest-avatar.svg";

import { rgba } from "polished";
import { buildQuestionnairePath } from "utils/UrlUtils";

const TruncatedQuestionnaireLink = Truncated.withComponent(QuestionnaireLink);
TruncatedQuestionnaireLink.displayName = "TruncatedQuestionnaireLink";

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

const Permissions = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
`;

const Permission = styled.li`
  background: ${colors.darkGrey};
  font-weight: bold;
  line-height: 1.2;
  padding: 0.2em 0.5em;
  border-radius: 3px;
  color: white};
  letter-spacing: 0.05em;
  font-size: 0.7em;
  text-transform: uppercase;
  :not(:last-of-type) {
    margin-right: 0.5em;
  }
  ${props =>
    props.disabled &&
    css`
      background: ${colors.lightGrey};
    `}
`;

const User = styled.div`
  display: flex;
  align-items: center;
`;

const UserImg = styled.img`
  width: 1em;
  height: 1em;
  margin-right: 0.5em;
`;

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

class Row extends React.PureComponent {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire.isRequired,
    onDeleteQuestionnaire: PropTypes.func.isRequired,
    onDuplicateQuestionnaire: PropTypes.func.isRequired,
    in: PropTypes.bool,
    exit: PropTypes.bool,
    enter: PropTypes.bool,
    autoFocus: PropTypes.bool,
  };

  state = {
    showDeleteQuestionnaireDialog: false,
    linkHasFocus: false,
  };

  handleOpenDeleteQuestionnaireDialog = () =>
    this.setState({ showDeleteQuestionnaireDialog: true });

  handleOpenDeleteQuestionnaireDialog = () => {
    this.props.onDeleteQuestionnaire(this.props.questionnaire);
  };

  handleDeleteQuestionnaire = () => {
    this.setState({ showDeleteQuestionnaireDialog: false }, () =>
      this.props.onDeleteQuestionnaire(this.props.questionnaire.id)
    );
  };

  rowRef = React.createRef();
  buttonsRef = React.createRef();

  handleDuplicateQuestionnaire = () => {
    this.props.onDuplicateQuestionnaire(this.props.questionnaire);
  };

  isQuestionnaireADuplicate() {
    return this.props.questionnaire.id.startsWith("dupe");
  }

  focusLink() {
    this.rowRef.current.getElementsByTagName("a")[0].focus();
  }

  componentDidMount() {
    if (this.props.dupe || this.props.autoFocus) {
      this.focusLink();
    }
  }

  componentDidUpdate() {
    if (this.props.autoFocus) {
      this.focusLink();
    }
  }

  handleClick = () => {
    this.props.history.push(
      buildQuestionnairePath({
        questionnaireId: this.props.questionnaire.id,
      })
    );
  };

  handleFocus = e => {
    this.setState({
      linkHasFocus: !this.buttonsRef.current.contains(e.target),
    });
  };

  handleBlur = e => {
    this.setState({
      linkHasFocus: false,
    });
  };

  render() {
    const {
      questionnaire,
      onDeleteQuestionnaire,
      dupe,
      odd,
      editor,
      ...rest
    } = this.props;

    return (
      <TR
        innerRef={this.rowRef}
        disabled={dupe}
        odd={odd}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        linkHasFocus={this.state.linkHasFocus}
        {...rest}
      >
        <TD onClick={this.handleClick}>
          <QuestionnaireLink
            data-test="anchor-questionnaire-title"
            questionnaire={questionnaire}
            title={questionnaire.title}
            disabled={dupe}
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
        <TD onClick={this.handleClick}>
          <User>
            <UserImg src={guestAvatar} />
            <Truncated>{questionnaire.createdBy.name || "Unknown"}</Truncated>
          </User>
        </TD>
        <TD onClick={this.handleClick}>
          <Permissions>
            <Permission>VIEW</Permission>
            <Permission disabled={!editor}>EDIT</Permission>
          </Permissions>
        </TD>
        <TD>
          <div ref={this.buttonsRef}>
            <ButtonGroup>
              <DuplicateButton
                data-test="btn-duplicate-questionnaire"
                onClick={this.handleDuplicateQuestionnaire}
                disabled={dupe}
                style={{ marginRight: "0.5em" }}
              />
              <IconButtonDelete
                hideText
                data-test="btn-delete-questionnaire"
                onClick={partial(onDeleteQuestionnaire, questionnaire.id)}
                disabled={dupe || !editor}
              />
            </ButtonGroup>
          </div>
        </TD>
      </TR>
    );
  }
}

export default withRouter(Row);
