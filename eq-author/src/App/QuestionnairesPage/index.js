import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight } from "lodash";
import { connect } from "react-redux";

import CustomPropTypes from "custom-prop-types";

import ScrollPane from "components/ScrollPane";
import BaseLayout from "components/BaseLayout";
import { CenteredPanel } from "components/Panel";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import MainCanvas from "components/MainCanvas";
import Loading from "components/Loading";
import Error from "components/Error";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

import QuestionnairesView from "./QuestionnairesView";
import QuestionnairesTable from "./QuestionnairesTable";
import withDeleteQuestionnaire from "./withDeleteQuestionnaire";
import withCreateQuestionnaire from "./withCreateQuestionnaire";
import withDuplicateQuestionnaire from "./withDuplicateQuestionnaire";

import { raiseToast } from "redux/toast/actions";

const StyledButtonGroup = styled(ButtonGroup)`
  margin: 0 0 1em;
`;

const StyledCenteredPanel = styled(CenteredPanel)`
  padding: 0;
`;

const QUESTIONNAIRES_QUERY = gql`
  query GetQuestionnaireList {
    questionnaires {
      ...QuestionnaireDetails
    }
  }
  ${QuestionnairesTable.fragments.QuestionnaireDetails}
`;

export class UnconnectedQuestionnairesPage extends React.PureComponent {
  state = {
    isModalOpen: false,
  };

  handleModalOpen = () => this.setState({ isModalOpen: true });
  handleModalClose = () => this.setState({ isModalOpen: false });

  renderResults = response => {
    const { loading, error, data } = response;
    const {
      onCreateQuestionnaire,
      onDeleteQuestionnaire,
      onDuplicateQuestionnaire,
    } = this.props;

    if (loading) {
      return <Loading height="24.25rem">Questionnaires loading…</Loading>;
    }

    if (error) {
      return <Error>Oops! Questionnaires could not be found</Error>;
    }

    return (
      <QuestionnairesView
        questionnaires={data.questionnaires}
        onDeleteQuestionnaire={onDeleteQuestionnaire}
        onDuplicateQuestionnaire={onDuplicateQuestionnaire}
        onCreateQuestionnaire={onCreateQuestionnaire}
      />
    );
  };

  renderTitle = title => `Your Questionnaires - ${title}`;

  render() {
    const { onCreateQuestionnaire } = this.props;

    return (
      <BaseLayout title={"Your Questionnaires"}>
        <ScrollPane permanentScrollBar>
          <MainCanvas>
            <QuestionnaireSettingsModal
              isOpen={this.state.isModalOpen}
              onClose={this.handleModalClose}
              onSubmit={onCreateQuestionnaire}
              confirmText="Create"
            />
            <Query query={QUESTIONNAIRES_QUERY}>{this.renderResults}</Query>
          </MainCanvas>
        </ScrollPane>
      </BaseLayout>
    );
  }
}

UnconnectedQuestionnairesPage.propTypes = {
  loading: PropTypes.bool,
  questionnaires: CustomPropTypes.questionnaireList,
  onCreateQuestionnaire: PropTypes.func.isRequired,
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func.isRequired,
};

export default flowRight(
  connect(
    null,
    { raiseToast }
  ),
  withCreateQuestionnaire,
  withDuplicateQuestionnaire,
  withDeleteQuestionnaire
)(UnconnectedQuestionnairesPage);
