import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { sortBy, get, clamp, reverse, map, chunk } from "lodash";
import gql from "graphql-tag";
import scrollIntoView from "utils/scrollIntoView";

import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import questionConfirmationIcon from "./icon-questionnaire.svg";

import iconArrow from "./icon-arrow-down.svg";
import iconAlert from "./icon-alert.svg";
import Row from "App/QuestionnairesPage/QuestionnairesTable/Row";
import Pagination from "react-paginating";
import PaginationNav from "../Pagination";
import { colors } from "constants/theme";
import isEditor from "utils/isEditor";
import { DESC } from "redux/homepage";

const paginationChunk = 24;

const Table = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
`;

const TH = styled.th`
  padding: 1em;
  color: #666;
  width: ${props => props.colWidth};
  border-bottom: 1px solid #e2e2e2;
  font-weight: normal;
  font-size: 0.9em;
`;

const SortButton = styled.span`
  display: flex;
  align-items: center;
  cursor: pointer;
  opacity: 0.8;

  &::after {
    content: url(${iconArrow});
    display: inline-block;
    width: 16px;
    height: 16px;
    opacity: ${props => (props.active ? "0.8" : "0.2")};
    transform: rotate(${props => (props.order === DESC ? "0deg" : "180deg")});
  }

  &:hover {
    opacity: 1;
  }
`;

const Panel = styled.div`
  background: white;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Alert = styled.div`
  padding: 5em;
  text-align: center;
  color: #666;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &::before {
    display: inline-block;
    content: url(${iconAlert});
    width: 2em;
    height: 2em;
    margin-bottom: 0.5em;
  }
`;

const AlertTitle = styled.h1`
  font-size: 1.1em;
  margin: 0 0 0.5em;
  font-weight: bold;
  color: ${colors.text};
`;

const AlertText = styled.p`
  font-size: 1em;
  margin: 0;
  font-weight: normal;
`;

const SortableTH = ({
  children,
  sortBy,
  sortOrder,
  sortKey,
  onSortClick,
  ...otherProps
}) => {
  const active = sortKey === sortBy;

  return (
    <TH aria-sort={active ? sortOrder : "none"} {...otherProps}>
      <SortButton
        active={active}
        order={active ? sortOrder : DESC}
        role="button"
        onClick={() => onSortClick(sortKey)}
      >
        {children}
      </SortButton>
    </TH>
  );
};

const TableHead = props => {
  return (
    <thead>
      <tr>
        <SortableTH sortKey="title" colWidth="38%" {...props}>
          Title
        </SortableTH>
        <SortableTH sortKey="createdAt" colWidth="10%" {...props}>
          Created
        </SortableTH>
        <SortableTH sortKey="modifiedAt" colWidth="10%" {...props}>
          Modified
        </SortableTH>
        <SortableTH sortKey="createdBy.id" colWidth="20%" {...props}>
          Created by
        </SortableTH>
        <TH colWidth="12%" {...props}>
          Permissions
        </TH>
        <TH colWidth="10%">Actions</TH>
      </tr>
    </thead>
  );
};

const TableFooter = styled.div`
  display: flex;
  margin: 1em 0;
  align-items: center;
`;

const Results = styled.div`
  color: ${colors.textLight};
  font-size: 0.9em;
  position: absolute;
`;

const TBody = props => <tbody {...props} />;

export class UnconnectedQuestionnairesTable extends React.PureComponent {
  static propTypes = {
    questionnaires: CustomPropTypes.questionnaireList,
    onDeleteQuestionnaire: PropTypes.func.isRequired,
    onDuplicateQuestionnaire: PropTypes.func.isRequired,
  };

  static fragments = {
    QuestionnaireDetails: gql`
      fragment QuestionnaireDetails on Questionnaire {
        id
        displayName
        title
        shortTitle
        createdAt
        createdBy {
          id
          name
        }
      }
    `,
  };

  headRef = React.createRef();

  state = {
    focusedId: null,
    showDeleteQuestionnaireDialog: false,
    deleteQuestionnaire: null,
  };

  handleOpenDeleteQuestionnaireDialog = deleteQuestionnaire =>
    this.setState({
      showDeleteQuestionnaireDialog: true,
      deleteQuestionnaire,
    });

  handleCloseDeleteQuestionnaireDialog = () => {
    this.setState({
      showDeleteQuestionnaireDialog: false,
      deleteQuestionnaire: null,
    });
  };

  handleDuplicateQuestionnaire = questionnaire => {
    scrollIntoView(this.headRef.current);
    this.props
      .onDuplicateQuestionnaire(questionnaire)
      .then(duplicateQuestionnaire => {
        this.setState({ focusedId: duplicateQuestionnaire.id });
      });
  };

  handleDeleteQuestionnaire = () => {
    const { questionnaires } = this.props;
    const { deleteQuestionnaire } = this.state;

    const possibleNextIndex =
      questionnaires.indexOf(
        questionnaires.find(q => q.id === deleteQuestionnaire.id)
      ) + 1;

    // If the last one is being removed then focus the one before that
    const nextIndex =
      possibleNextIndex > questionnaires.length - 1
        ? questionnaires.length - 2
        : possibleNextIndex;

    // We have to account to set focusedId to undefined when there are no
    // questionnaires left
    this.setState({
      focusedId: (questionnaires[nextIndex] || {}).id,
      showDeleteQuestionnaireDialog: false,
      deleteQuestionnaire: null,
    });

    this.props.onDeleteQuestionnaire(deleteQuestionnaire.id);
  };

  handleSortClick = sortKey => {
    const { setSort } = this.props;
    setSort(sortKey);
  };

  renderResults = (pages, currentPage, sharing, currentUser, focusedId) =>
    map(pages[currentPage - 1], (questionnaire, index) => {
      const dupe = questionnaire.id.startsWith("dupe");
      const questionnaireSharing = get(sharing, questionnaire.id, {
        users: [],
      });

      const editor = isEditor(
        questionnaireSharing.users,
        currentUser,
        questionnaire
      );

      return (
        <Row
          key={questionnaire.id}
          editor={editor}
          odd={index % 2}
          dupe={dupe}
          autoFocus={questionnaire.id === focusedId}
          questionnaire={questionnaire}
          onDeleteQuestionnaire={this.handleDeleteQuestionnaire}
          onDuplicateQuestionnaire={this.handleDuplicateQuestionnaire}
        />
      );
    });

  render() {
    const {
      questionnaires,
      sharing,
      currentUser,
      hideReadOnly,
      searchTerm,
      currentPage,
      sort,
      setCurrentPage,
    } = this.props;
    let displayedQuestionnaires = questionnaires;
    const { focusedId } = this.state;

    if (hideReadOnly) {
      displayedQuestionnaires = questionnaires.filter(q => {
        const questionnaireSharing = get(sharing, q.id);

        if (questionnaireSharing) {
          return isEditor(questionnaireSharing.users, currentUser, q);
        } else {
          return isEditor([], currentUser, q);
        }
      });
    }

    displayedQuestionnaires = sortBy(displayedQuestionnaires, q =>
      get(q, sort.by).toLowerCase()
    );

    if (sort.order === DESC) {
      displayedQuestionnaires = reverse(displayedQuestionnaires);
    }

    const pages = chunk(displayedQuestionnaires, paginationChunk);
    const total = pages.length * paginationChunk;
    const clampedCurrentPage = clamp(currentPage, 0, pages.length);

    return (
      <Pagination
        total={total}
        limit={paginationChunk}
        pageCount={0}
        currentPage={clampedCurrentPage}
      >
        {({ ...rest }) => (
          <div>
            <Panel>
              {questionnaires.length > 0 ? (
                hideReadOnly && displayedQuestionnaires.length < 1 ? (
                  searchTerm ? (
                    <Alert>
                      <AlertTitle>
                        {`No results found for '${searchTerm}'`}
                      </AlertTitle>
                      <AlertText>
                        Please check you have editor access to this
                        questionnaire
                      </AlertText>
                    </Alert>
                  ) : (
                    <Alert>
                      <AlertTitle>
                        You do not have editor access to any questionnaires
                      </AlertTitle>
                      <AlertText>
                        Create a questionnaire yourself or request access to an
                        existing one
                      </AlertText>
                    </Alert>
                  )
                ) : (
                  <Table role="grid">
                    <TableHead
                      onSortClick={this.handleSortClick}
                      sortBy={sort.by}
                      sortOrder={sort.order}
                    />
                    <TBody>
                      {this.renderResults(
                        pages,
                        clampedCurrentPage,
                        sharing,
                        currentUser,
                        focusedId
                      )}
                    </TBody>
                  </Table>
                )
              ) : (
                <Alert>
                  <AlertTitle>{`No results found for '${searchTerm}'`}</AlertTitle>
                  <AlertText>
                    Please check that you have entered the search term correctly
                  </AlertText>
                </Alert>
              )}
            </Panel>
            <TableFooter>
              <Results>
                Showing{" "}
                {paginationChunk < displayedQuestionnaires.length
                  ? paginationChunk
                  : displayedQuestionnaires.length}{" "}
                of {displayedQuestionnaires.length} results
              </Results>
              <PaginationNav
                currentPage={clampedCurrentPage}
                onPageChange={setCurrentPage}
                {...rest}
              />
            </TableFooter>
          </div>
        )}
      </Pagination>
    );
  }
}

export default UnconnectedQuestionnairesTable;
