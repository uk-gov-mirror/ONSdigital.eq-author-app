import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { TransitionGroup } from "react-transition-group";
import { isEmpty, map } from "lodash";
import gql from "graphql-tag";
import scrollIntoView from "utils/scrollIntoView";

import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import questionConfirmationIcon from "./icon-questionnaire.svg";

import Row from "App/QuestionnairesPage/QuestionnairesTable/Row";
import { colors } from "constants/theme";

const Table = styled.table`
  width: 100%;
  font-size: 0.9em;
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

TH.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

const TableHead = props => {
  return (
    <thead>
      <tr>
        <th colWidth="55%" {...props}>
          Title
        </th>
        <th colWidth="15%" {...props}>
          Created
        </th>
        <th colWidth="15%" {...props}>
          Modified
        </th>
        <th colWidth="15%">Actions</th>
      </tr>
    </thead>
  );
};

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

  renderResults = pages =>
    map(pages, (questionnaire, index) => {
      return (
        <Row
          key={questionnaire.id}
          odd={index % 2}
          questionnaire={questionnaire}
          onDeleteQuestionnaire={this.handleDeleteQuestionnaire}
          onDuplicateQuestionnaire={this.handleDuplicateQuestionnaire}
        />
      );
    });

  render() {
    const { questionnaires } = this.props;
    const { showDeleteQuestionnaireDialog, deleteQuestionnaire } = this.state;

    if (isEmpty(questionnaires)) {
      return <p>You have no questionnaires</p>;
    }

    return (
      <>
        <Table>
          <TableHead ref={this.headRef}>
            <tr>
              <TH colWidth="50%">Questionnaire name</TH>
              <TH colWidth="15%">Date</TH>
              <TH colWidth="22%">Created by</TH>
              <TH colWidth="14%" />
            </tr>
          </TableHead>
          <TBody>{this.renderResults(questionnaires)}</TBody>
        </Table>
        <DeleteConfirmDialog
          isOpen={showDeleteQuestionnaireDialog}
          onClose={this.handleCloseDeleteQuestionnaireDialog}
          onDelete={this.handleDeleteQuestionnaire}
          title={deleteQuestionnaire && deleteQuestionnaire.displayName}
          alertText="This questionnaire including all sections and questions will be deleted."
          icon={questionConfirmationIcon}
          data-test="delete-questionnaire"
        />
      </>
    );
  }
}

export default UnconnectedQuestionnairesTable;
