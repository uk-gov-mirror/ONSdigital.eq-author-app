import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { flowRight } from "lodash";
import { Titled } from "react-titled";
import { connect } from "react-redux";

import CustomPropTypes from "custom-prop-types";

import BaseLayout from "components/BaseLayout";
import { CenteredPanel } from "components/Panel";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import MainCanvas from "components/MainCanvas";
import Loading from "components/Loading";
import Error from "components/Error";

import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

import QuestionnairesTable from "./QuestionnairesTable";
import withQuestionnaireList from "./withQuestionnaireList";
import withDeleteQuestionnaire from "./withDeleteQuestionnaire";
import withCreateQuestionnaire from "./withCreateQuestionnaire";
import withDuplicateQuestionnaire from "./withDuplicateQuestionnaire";

import { raiseToast } from "redux/toast/actions";

import withCreateMetadata from "App/MetadataModal/withCreateMetadata.js";
import withUpdateMetadata from "App/MetadataModal/withUpdateMetadata.js";
import { createIntro } from "redux/questionnaireIntro/actions";

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
    isModalOpen: false
  };

  handleModalOpen = () => this.setState({ isModalOpen: true });
  handleModalClose = () => this.setState({ isModalOpen: false });

  renderResults = response => {
    const { loading, error, data } = response;

    if (loading) {
      return <Loading height="24.25rem">Questionnaires loading…</Loading>;
    }

    if (error) {
      return <Error>Oops! Questionnaires could not be found</Error>;
    }

    return (
      <QuestionnairesTable
        questionnaires={data.questionnaires}
        onDeleteQuestionnaire={this.props.onDeleteQuestionnaire}
        onDuplicateQuestionnaire={this.props.onDuplicateQuestionnaire}
      />
    );
  };

  renderTitle = title => `Your Questionnaires - ${title}`;

  render() {
    const {
      onCreateQuestionnaire,
      createIntro,
      onAddMetadata,
      onUpdateMetadata
    } = this.props;

    return (
      <Titled title={this.renderTitle}>
        <BaseLayout title={"Your Questionnaires"}>
          <MainCanvas>
            <StyledButtonGroup horizontal>
              <Button
                onClick={this.handleModalOpen}
                primary
                data-test="create-questionnaire"
              >
                Create
              </Button>
              <QuestionnaireSettingsModal
                isOpen={this.state.isModalOpen}
                onClose={this.handleModalClose}
                onSubmit={questionnaire => {
                  if (questionnaire.theme === "default") {
                    onCreateQuestionnaire(questionnaire).then(({ id }) => {
                      let tradAsMetadata, ruNameMetadata;

                      onAddMetadata(id).then(
                        ({ data: { createMetadata: metadata } }) => {
                          if (questionnaire.theme === "default") {
                            tradAsMetadata = {
                              id: metadata.id,
                              key: "trad_as",
                              alias: "Trad As",
                              type: "Text",
                              textValue: "ESSENTIAL ENTERPRISE LTD."
                            };

                            onAddMetadata(id).then(
                              ({ data: { createMetadata: metadata } }) => {
                                if (questionnaire.theme === "default") {
                                  ruNameMetadata = {
                                    id: metadata.id,
                                    key: "ru_name",
                                    alias: "RU Name",
                                    type: "Text",
                                    textValue: "ESSENTIAL ENTERPRISE LTD."
                                  };

                                  onUpdateMetadata(tradAsMetadata);

                                  onUpdateMetadata(ruNameMetadata);
                                  createIntro(id, {
                                    tradAsMetadata,
                                    ruNameMetadata
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    });
                  } else {
                    onCreateQuestionnaire(questionnaire);
                  }
                }}
                confirmText="Create"
                enableTheme
              />
            </StyledButtonGroup>
            <StyledCenteredPanel>
              <Query query={QUESTIONNAIRES_QUERY}>{this.renderResults}</Query>
            </StyledCenteredPanel>
          </MainCanvas>
        </BaseLayout>
      </Titled>
    );
  }
}

UnconnectedQuestionnairesPage.propTypes = {
  loading: PropTypes.bool,
  questionnaires: CustomPropTypes.questionnaireList,
  onCreateQuestionnaire: PropTypes.func.isRequired,
  onDeleteQuestionnaire: PropTypes.func.isRequired,
  onDuplicateQuestionnaire: PropTypes.func.isRequired
};

export default flowRight(
  connect(
    null,
    { raiseToast, createIntro }
  ),
  withCreateMetadata,
  withUpdateMetadata,
  withCreateQuestionnaire,
  withDuplicateQuestionnaire,
  withDeleteQuestionnaire, // relies on raiseToast to display undo
  withQuestionnaireList
)(UnconnectedQuestionnairesPage);
