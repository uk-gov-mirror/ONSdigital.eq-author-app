import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { colors } from "constants/theme";
import config from "config";

import { raiseToast } from "redux/toast/actions";

import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import PageTitle from "components/PageTitle";
import Button from "components/buttons/Button";
import LinkButton from "components/buttons/Button/LinkButton";
import UserProfile from "App/UserProfile";

import { signOutUser } from "redux/auth/actions";

import shareIcon from "components/Header/icon-share.svg?inline";
import viewIcon from "components/Header/icon-view.svg?inline";

import IconText from "components/IconText";

import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight, get } from "lodash/fp";
import SettingsIcon from "./icon-cog.svg?inline";
import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

import pipeP from "utils/pipeP";
import SavingIndicator from "components/SavingIndicator";
import ButtonGroup from "components/buttons/ButtonGroup";

const StyledHeader = styled.header`
  color: ${colors.white};
  background: ${colors.primary};
  font-weight: 400;
  position: relative;
`;

const Flex = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 1em 1.5em;
`;

const Subtitle = styled.div`
  font-weight: bold;
`;

export const UtilityBtns = styled.div`
  display: flex;
  flex: 1 0 25%;
  justify-content: flex-end;
  margin-right: -1.5em;
`;

const SavingContainer = styled.div`
  position: absolute;
  right: 1em;
  bottom: 0.5em;
`;

export class UnconnectedHeader extends React.Component {
  static propTypes = {
    signOutUser: PropTypes.func.isRequired,
    raiseToast: PropTypes.func.isRequired,
  };

  displayToast = () => {
    this.props.raiseToast("ShareToast", "Link copied to clipboard");
  };

  handleSignOut = () => {
    this.props.signOutUser();
  };

  getPreviewUrl(questionnaireId) {
    return `${config.REACT_APP_LAUNCH_URL}/${questionnaireId}`;
  }

  handleShare = () => {
    const textField = document.createElement("textarea");
    textField.innerText = this.getPreviewUrl(this.props.data.questionnaire.id);
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    this.displayToast();
  };

  handleSettingsModalOpen = () => this.setState({ isSettingsModalOpen: true });

  handleSettingsModalClose = () =>
    this.setState({ isSettingsModalOpen: false });

  render() {
    const { data, children, title } = this.props;
    const currentUser = get("data.me", this.props);
    const { questionnaire } = data;

    return (
      <StyledHeader>
        <Flex>
          <Subtitle>{questionnaire && questionnaire.displayName}</Subtitle>
          <UtilityBtns>
            {questionnaire && (
              <ButtonGroup horizontal align="right" margin="0.5em">
                <Button data-test="settings-btn" variant="tertiary-light" small>
                  <IconText icon={SettingsIcon}>Settings</IconText>
                </Button>
                <LinkButton
                  href={this.getPreviewUrl(questionnaire.id)}
                  variant="tertiary-light"
                  data-test="btn-preview"
                  small
                >
                  <IconText icon={viewIcon}>View survey</IconText>
                </LinkButton>
                <Button
                  variant="tertiary-light"
                  onClick={this.handleShare}
                  data-test="btn-share"
                  small
                >
                  <IconText icon={shareIcon}>Share</IconText>
                </Button>
                {currentUser && (
                  <UserProfile
                    user={currentUser}
                    onSignOut={this.handleSignOut}
                  />
                )}
              </ButtonGroup>
            )}
          </UtilityBtns>
        </Flex>

        <PageTitle>{title}</PageTitle>
        {children}
        <SavingContainer>
          <SavingIndicator />
        </SavingContainer>
      </StyledHeader>
    );
  }
}

const QUESTIONNAIRE_QUERY = gql`
  query GetQuestionnaire($input: QueryInput!) {
    questionnaire(input: $input) {
      id
      displayName
    }
    me {
      id
      name
      email
      picture
    }
  }
`;

export const withCurrentUser = Component => {
  const Comp = props => (
    <Query
      query={QUESTIONNAIRE_QUERY}
      variables={{
        input: {
          questionnaireId: props.match.params.questionnaireId,
        },
      }}
    >
      {innerProps => {
        return <Component {...innerProps} {...props} />;
      }}
    </Query>
  );
  Comp.propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };
  return Comp;
};

export default flowRight(
  connect(
    null,
    { signOutUser, raiseToast }
  ),
  withRouter,
  withCurrentUser
)(UnconnectedHeader);
