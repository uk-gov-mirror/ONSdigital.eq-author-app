import React, { PureComponent } from "react";
import styled from "styled-components";

import gql from "graphql-tag";
import { debounce, throttle, isEmpty, flow } from "lodash";

import QuestionnairesTable from "./QuestionnairesTable";

//import iconSearch from "./icon-search.svg";
import VisuallyHidden from "components/VisuallyHidden";
import { colors } from "constants/theme";
import { Input } from "components/Forms";

import Button from "components/buttons/Button";
import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import { Query } from "react-apollo";
import { connect } from "react-redux";

const Header = styled.div`
  margin: 1em 0;
  display: flex;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
`;

class QuestionnairesView extends PureComponent {
  state = {
    isModalOpen: false,
  };

  render() {
    let filteredQuestionnaires;

    const {
      questionnaires,
      onDeleteQuestionnaire,
      onDuplicateQuestionnaire,
      onCreateQuestionnaire,
      data,
      addUser,
      sharing,
      searchTerm,
      hideReadOnly,
      setHideReadOnly,
      setSort,
      sort,
      currentPage,
      setCurrentPage,
    } = this.props;

    return (
      <>
        <Header>
          <Button
            onClick={this.handleModalOpen}
            primary
            data-test="create-questionnaire"
          >
            Create questionnaire
          </Button>
        </Header>

        <QuestionnairesTable
          questionnaires={questionnaires}
          onDeleteQuestionnaire={onDeleteQuestionnaire}
          onDuplicateQuestionnaire={onDuplicateQuestionnaire}
          sharing={sharing}
          currentUser={data.me}
          hideReadOnly={hideReadOnly}
          searchTerm={searchTerm}
          setSort={setSort}
          sort={sort}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <QuestionnaireSettingsModal
          isOpen={this.state.isModalOpen}
          onClose={this.handleModalClose}
          onSubmit={questionnaire => onCreateQuestionnaire(questionnaire)}
          confirmText="Create"
        />
      </>
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
  const Comp = props => (
    <Query query={CURRENT_USER_QUERY} fetchPolicy="network-only">
      {innerProps => {
        return <Component {...innerProps} {...props} />;
      }}
    </Query>
  );

  return Comp;
};

export default flow(withCurrentUser)(QuestionnairesView);
