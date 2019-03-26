import React, { PureComponent } from "react";
import styled from "styled-components";

import gql from "graphql-tag";
import { debounce, throttle, isEmpty, flow } from "lodash";

import QuestionnairesTable from "./QuestionnairesTable";

import iconSearch from "./icon-search.svg";
import VisuallyHidden from "components/VisuallyHidden";
import { colors } from "constants/theme";
import { Input } from "components/Forms";

import Button from "components/buttons/Button";
import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";
import { Query } from "react-apollo";
import { connect } from "react-redux";
import flag from "./flag.svg";

import Filter from "./Filter";

import { addUser } from "redux/sharing";
import {
  setSearchTerm,
  setHideReadOnly,
  setSort,
  setCurrentPage,
} from "redux/homepage";

const Header = styled.div`
  margin: 1em 0;
  display: flex;
  z-index: 1;
  align-items: center;
  justify-content: space-between;
`;

const NoResults = styled.div`
  padding: 6em 0 10em;
  text-align: center;
`;

const NoResultsTitle = styled.h2`
  font-size: 1.3em;
  font-weight: 500;
  margin: 0 0 0.5em;

  &::before {
    content: url(${flag});
    display: block;
  }
`;

const NoResultsText = styled.p`
  margin: 0 0 1em;
  color: ${colors.textLight};
`;

const Search = styled.div`
  position: relative;
  &::before {
    content: url(${iconSearch});
    display: inline-block;
    position: absolute;
    left: 0.5em;
    top: 0;
    bottom: 0;
    height: 2em;
    margin: auto;
  }
`;

const SearchInput = styled(Input).attrs({
  type: "search",
  placeholder: "Search",
})`
  width: 20em;
  padding: 0.6em;
  line-height: 1;
  padding-left: 2.5em;
  border-radius: 4px;
  border-color: ${colors.bordersLight};

  &:hover {
    outline: none;
  }
`;

const AccessFilter = styled(Filter)`
  margin: 0 0 0 0.5em;
`;

class QuestionnairesView extends PureComponent {
  state = {
    isModalOpen: false,
  };

  debouncedSetState = debounce(this.props.setSearchTerm, 1000);

  throttledSetState = throttle(this.props.setSearchTerm, 500);

  handleModalOpen = () => this.setState({ isModalOpen: true });

  handleModalClose = () => this.setState({ isModalOpen: false });

  handleSearchChange = ({ value }) => {
    const searchTerm = value.toLowerCase();

    if (value.length < 5) {
      this.throttledSetState(searchTerm);
    } else {
      this.debouncedSetState(searchTerm);
    }
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

    const isFiltered = !isEmpty(searchTerm);

    filteredQuestionnaires = isFiltered
      ? questionnaires.filter(q => q.title.toLowerCase().includes(searchTerm))
      : questionnaires;

    return (
      <>
        {isEmpty(questionnaires) ? (
          <NoResults>
            <NoResultsTitle>No questionnaires found</NoResultsTitle>
            <NoResultsText>
              {"You don't have access to any questionnaires yet."}
            </NoResultsText>
            <Button
              onClick={this.handleModalOpen}
              variant="primary"
              data-test="create-questionnaire"
            >
              Create a questionnaire
            </Button>
          </NoResults>
        ) : (
          <>
            <Header>
              <Search>
                <VisuallyHidden>
                  <label htmlFor="search">Search</label>
                </VisuallyHidden>
                <SearchInput
                  id="search"
                  defaultValue={searchTerm}
                  onChange={this.handleSearchChange}
                />
              </Search>

              <AccessFilter
                handleSetHideReadOnly={setHideReadOnly}
                hideReadOnly={hideReadOnly}
              />

              <Button
                onClick={this.handleModalOpen}
                primary
                data-test="create-questionnaire"
              >
                Create questionnaire
              </Button>
            </Header>

            <QuestionnairesTable
              questionnaires={filteredQuestionnaires}
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
          </>
        )}
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

const mapDispatch = dispatch => {
  return {
    addUser: (user, questionnaireId) =>
      dispatch(addUser({ user, questionnaireId })),
    setSearchTerm: searchTerm => dispatch(setSearchTerm(searchTerm)),
    setHideReadOnly: hideReadOnly => dispatch(setHideReadOnly(hideReadOnly)),
    setSort: sortKey => dispatch(setSort(sortKey)),
    setCurrentPage: (page, totalPages) =>
      dispatch(setCurrentPage(page, totalPages)),
  };
};

const mapState = state => ({
  sharing: state.sharing,
  searchTerm: state.homepage.searchTerm,
  hideReadOnly: state.homepage.hideReadOnly,
  sort: state.homepage.sort,
  currentPage: state.homepage.currentPage,
});

export default flow(
  withCurrentUser,
  connect(
    mapState,
    mapDispatch
  )
)(QuestionnairesView);
