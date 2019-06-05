import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { colors } from "constants/theme";

import { raiseToast } from "redux/toast/actions";

import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { withRouter } from "react-router-dom";

import UserProfile from "App/UserProfile";

import { signOutUser } from "redux/auth/actions";

import Truncated from "components/Truncated";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight, get } from "lodash/fp";
import { Routes } from "utils/UrlUtils";

import Logo from "components/Logo";

const StyledHeader = styled.header`
  background-color: ${colors.black};
  color: ${colors.white};
  font-weight: 400;
`;

const Flex = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
`;

const PageTitle = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: pre;
  flex: 1 1 auto;
`;

const TruncatedTitle = Truncated.withComponent("h1");
const Title = styled(TruncatedTitle)`
  font-size: 1.2em;
  font-weight: 600;
  margin: 0;
  width: 100%;
  text-align: center;
  line-height: 1.3;
`;

export const StyledUserProfile = styled(UserProfile)`
  width: auto;
  justify-self: flex-end;
`;

export class UnconnectedHeader extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire,
    signOutUser: PropTypes.func.isRequired,
    raiseToast: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  handleSignOut = () => {
    this.props.signOutUser();
  };

  render() {
    const { title } = this.props;
    const currentUser = get("data.me", this.props);

    return (
      <StyledHeader>
        <Flex>
          <Logo />

          <PageTitle>
            <Title>{title}</Title>
          </PageTitle>

          {currentUser && (
            <StyledUserProfile
              user={currentUser}
              onSignOut={this.handleSignOut}
            />
          )}
        </Flex>
      </StyledHeader>
    );
  }
}

const CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    me {
      id
      name
      email
      picture
    }
  }
`;

export const withCurrentUser = Component => {
  const Comp = props =>
    props.match.path !== Routes.SIGN_IN ? (
      <Query query={CURRENT_USER_QUERY} fetchPolicy="network-only">
        {innerProps => {
          return <Component {...innerProps} {...props} />;
        }}
      </Query>
    ) : (
      <Component {...props} />
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
