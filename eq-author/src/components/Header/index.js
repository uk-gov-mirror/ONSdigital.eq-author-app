import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { colors } from "constants/theme";
import config from "config";

import { raiseToast } from "redux/toast/actions";

import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { Link, withRouter } from "react-router-dom";

import Button from "components/buttons/Button";
import LinkButton from "components/buttons/Button/LinkButton";
import UserProfile from "App/UserProfile";

import { signOutUser } from "redux/auth/actions";

import shareIcon from "components/Header/icon-share.svg?inline";
import viewIcon from "components/Header/icon-view.svg?inline";

import IconText from "components/IconText";
import Truncated from "components/Truncated";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight, get } from "lodash/fp";
import { Routes } from "utils/UrlUtils";

const StyledHeader = styled.header`
  background-color: ${colors.primary};
  color: ${colors.white};
  font-weight: 400;
  padding: 1em 1.5em;
`;

const Flex = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
`;

const Subtitle = styled.div`
  font-weight: bold;
`;

const ShareButton = styled(Button)`
  margin-left: 0.5em;
`;

export const StyledUserProfile = styled(UserProfile)`
  width: auto;
  margin-left: 0.5em;
`;

export const UtilityBtns = styled.div`
  display: flex;
  flex: 1 0 25%;
  justify-content: flex-end;
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

  render() {
    const { data, loading, error, children } = this.props;
    const currentUser = get("data.me", this.props);
    const { questionnaire } = data;

    return (
      <div>
        <StyledHeader>
          <Flex>
            <Subtitle>{questionnaire && questionnaire.displayName}</Subtitle>

            <UtilityBtns>
              {questionnaire && (
                <React.Fragment>
                  <LinkButton
                    href={this.getPreviewUrl(questionnaire.id)}
                    variant="tertiary-light"
                    data-test="btn-preview"
                    small
                  >
                    <IconText icon={viewIcon}>View survey</IconText>
                  </LinkButton>
                  <ShareButton
                    variant="tertiary-light"
                    onClick={this.handleShare}
                    data-test="btn-share"
                    small
                  >
                    <IconText icon={shareIcon}>Share</IconText>
                  </ShareButton>
                </React.Fragment>
              )}
              {currentUser && (
                <StyledUserProfile
                  user={currentUser}
                  onSignOut={this.handleSignOut}
                />
              )}
            </UtilityBtns>
          </Flex>
        </StyledHeader>

        {children}
      </div>
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
