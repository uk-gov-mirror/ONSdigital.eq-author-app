import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { useMutation } from "react-apollo";

import { colors } from "constants/theme";

import updateQuestionnaireMutation from "graphql/updateQuestionnaire.graphql";

import Header from "components/EditorLayout/Header";
import ScrollPane from "components/ScrollPane";
import Panel, { InformationPanel } from "components/Panel";
import { Field, Input, Label } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const StyledPanel = styled(Panel)`
  max-width: 97.5%;
  margin: 1.5em auto;
  padding: 1.5em;
`;

const StyledInput = styled(Input)`
  width: 31em;
`;

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 0.6em;
  font-size: 0.85em;
`;

const HorizontalSeparator = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.5em 0;
`;

const VerticalSeparator = styled.div`
  width: 1px;
  height: 1.5em;
  background-color: ${colors.blue};
  margin-left: 0.8em;
  margin-bottom: 0.4em;
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

const Pill = ({ children, testId }) => {
  const Container = styled.div`
    width: 4em;
    padding: 0.5em 1em;
    box-sizing: content-box;
    background-color: ${colors.lightMediumGrey};
    text-align: center;

    p {
      margin: 0;
      font-weight: bold;
    }
  `;
  return (
    <Container>
      <p data-test={testId}>{children}</p>
    </Container>
  );
};
Pill.propTypes = {
  children: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};

const SettingsPage = ({ questionnaire }) => {
  const { title, shortTitle, type, id, navigation, summary } = questionnaire;

  const [updateQuestionnaire] = useMutation(updateQuestionnaireMutation);
  const [questionnaireTitle, setQuestionnaireTitle] = useState(title);
  const [questionnaireShortTitle, setQuestionnaireShortTitle] = useState(
    shortTitle
  );

  const handleTitleChange = ({ value }) => {
    value = value.trim();
    if (value !== "") {
      updateQuestionnaire({
        variables: { input: { id, title: value } },
      });
    }
  };

  const handleShortTitleChange = ({ value }) => {
    value = value.trim();
    updateQuestionnaire({
      variables: { input: { id, shortTitle: value } },
    });
  };

  return (
    <Container>
      <Header title="Settings" />
      <ScrollPane>
        <StyledPanel>
          <Field>
            <Label>Questionnaire title</Label>
            <Caption>Changes the questionnaire&apos;s title.</Caption>
            <StyledInput
              value={questionnaireTitle}
              onChange={({ value }) => setQuestionnaireTitle(value)}
              onBlur={e => handleTitleChange({ ...e.target })}
              data-test="change-questionnaire-title"
            />
          </Field>
          <Field>
            <Label>Short title (optional)</Label>
            <Caption>
              {shortTitle ? "Changes" : "Adds"} the questionnaire&apos;s short
              title. This is only used within Author. Respondents always see the
              full questionnaire title.
            </Caption>
            <StyledInput
              value={questionnaireShortTitle}
              onChange={({ value }) => setQuestionnaireShortTitle(value)}
              onBlur={e => handleShortTitleChange({ ...e.target })}
              data-test="change-questionnaire-short-title"
            />
          </Field>
          <HorizontalSeparator />
          <Field>
            <Label>Questionnaire type</Label>
            <Pill testId="questionnaire-type">{type}</Pill>
          </Field>
          <HorizontalSeparator />
          <InlineField>
            <Label>Section navigation</Label>
            <VerticalSeparator />
            <ToggleSwitch
              id="toggle-section-navigation"
              name="toggle-section-navigation"
              hideLabels={false}
              onChange={({ value }) =>
                updateQuestionnaire({
                  variables: { input: { id, navigation: value } },
                })
              }
              checked={navigation}
            />
          </InlineField>
          <InformationPanel>
            Let respondents move between sections while they&apos;re completing
            the questionnaire.
          </InformationPanel>
          <HorizontalSeparator />
          <InlineField>
            <Label>Answers summary</Label>
            <VerticalSeparator />
            <ToggleSwitch
              id="toggle-answer-summary"
              name="toggle-answer-summary"
              hideLabels={false}
              onChange={({ value }) =>
                updateQuestionnaire({
                  variables: { input: { id, summary: value } },
                })
              }
              checked={summary}
            />
          </InlineField>
          <InformationPanel>
            Let respondents check their answers before submitting their
            questionnaire.
          </InformationPanel>
        </StyledPanel>
      </ScrollPane>
    </Container>
  );
};
SettingsPage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object.isRequired,
};

export default withRouter(SettingsPage);
