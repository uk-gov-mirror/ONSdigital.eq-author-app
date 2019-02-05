import React, { Component } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

const Box = styled.div`
  border: 1px solid ${colors.borders};
  border-radius: 3px;
  margin-bottom: 2em;
  overflow: hidden;
`;

const Suggestions = styled.div``;
const SuggestionsHeader = styled.div`
  padding: 0.25em 0.5em;
  border-bottom: 1px solid ${colors.bordersLight};
`;
const SuggestionsTitle = styled.h2`
  font-size: 0.8em;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
  color: #7a7a7a;
`;
const SuggestionsBody = styled.div`
  border-bottom: 1px solid ${colors.bordersLight};
`;

const SuggestionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SuggestionsListItem = styled.li`
  margin: 0;
  padding: 0;
  &:not(:last-of-type) {
    border-bottom: 1px solid #d8d8d8;
  }
`;

const SuggestionButton = styled.button`
  padding: 0.5em;
  appearance: none;
  font-size: 1em;
  border: none;
  text-align: left;
  cursor: pointer;
  width: 100%;
  &:hover {
    background: ${colors.primary};
    color: white;
  }
`;

const SuggestionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 0.1em;
`;

const SuggestionSubtitle = styled.div`
  font-size: 0.9em;
`;

const suggestions = [
  {
    title: "Currency answers in this section",
    subTitle: "in Machinery and Equipment",
  },
  {
    title: "All currency answers",
    subTitle: "previous currency answers in this questionnaire",
  },
];

const answers = [
  { title: "Lorem ipsum" },
  { title: "Vestibulum Nullam Justo" },
];

const Answers = styled.div``;
const AnswerList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
`;

const AnswerListItem = styled.li`
  margin: 0;
  padding: 0.5em;
`;

const AnswerChip = styled.div`
  background: ${colors.primary};
  color: white;
  border-radius: 3px;
  padding: 0.2em 0.5em;
`;

export default class AnswerSelector extends Component {
  render() {
    return (
      <div>
        <Box>
          <Suggestions>
            <SuggestionsHeader>
              <SuggestionsTitle>Suggestions</SuggestionsTitle>
            </SuggestionsHeader>
            <SuggestionsBody>
              <SuggestionsList>
                {suggestions.map((suggestion, index) => (
                  <SuggestionsListItem suggestion={suggestion} key={index}>
                    <SuggestionButton>
                      <SuggestionTitle>{suggestion.title}</SuggestionTitle>
                      <SuggestionSubtitle>
                        {suggestion.subTitle}
                      </SuggestionSubtitle>
                    </SuggestionButton>
                  </SuggestionsListItem>
                ))}
              </SuggestionsList>
            </SuggestionsBody>
          </Suggestions>
          <Answers>
            <AnswerList>
              {answers.map((answer, index) => (
                <AnswerListItem key={index}>
                  <AnswerChip>{answer.title}</AnswerChip>
                </AnswerListItem>
              ))}
            </AnswerList>
          </Answers>
        </Box>
      </div>
    );
  }
}
