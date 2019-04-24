import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { propType } from "graphql-anywhere";
import { flatten, isEmpty, find, reduce, filter } from "lodash";
import { TransitionGroup } from "react-transition-group";
import gql from "graphql-tag";

import { colors } from "constants/theme";
import { CURRENCY, NUMBER, PERCENTAGE } from "constants/answer-types";
import FadeTransition from "components/transitions/FadeTransition";
import ContentPickerModal from "components/ContentPickerModal";

import Button from "components/buttons/Button";
import TextButton from "components/buttons/TextButton";

import AnswerChip from "./AnswerChip";
import iconInfo from "./icon-info.svg";

const validTypes = [CURRENCY, NUMBER, PERCENTAGE];

const Box = styled.div`
  border: 1px solid ${colors.borders};
  border-radius: 3px;
  margin-bottom: 2em;
  overflow: hidden;
`;

const Suggestions = styled.div`
  background: #fff;
  border: 1px solid ${colors.bordersLight};
  border-radius: 3px;
  margin-top: 1em;
  padding-bottom: 0.5em;
`;

const SuggestionsHeader = styled.div`
  padding: 0.5em 1em;
`;

const SuggestionsTitle = styled.h3`
  font-size: 0.8em;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
  color: #7a7a7a;
`;

const SuggestionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SuggestionsListItem = styled.li`
  margin: 0;
  padding: 0;
`;

export const SuggestionButton = styled.button`
  padding: 0.25em 1em;
  background: transparent;
  appearance: none;
  font-size: 1em;
  border: none;
  text-align: left;
  cursor: pointer;
  width: 100%;
  color: #4a4a4a;
  display: flex;
  align-items: center;

  &:hover {
    background: ${colors.lighterGrey};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }
`;

const SuggestionText = styled.span`
  flex: 1 1 auto;
`;

const SuggestionTitle = styled.div`
  font-weight: bold;
`;

const SuggestionSubtitle = styled.div`
  font-size: 0.9em;
`;

const SuggestionAnswers = styled.div`
  font-size: 0.8em;
  font-weight: bold;
  color: #7a7a7a;
  letter-spacing: 0.05em;
  margin-left: auto;
  flex: 0 0 auto;
  text-transform: uppercase;
`;

const RemoveAllButton = styled(TextButton)`
  letter-spacing: 0.05rem;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.8rem;
  margin: 0 0 0 auto;
`;

const Answers = styled.div`
  padding: 1em;
`;

const SectionList = styled.ul`
  list-style: none;
  margin: 0 0 0.5em;
  padding: 0;
`;

const SectionListItem = styled.li`
  margin: 0;
`;

const SectionHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 0.7em;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 0.9em;
  color: #807d77;
`;

const AnswerList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row wrap;
`;

const AnswerListItem = styled.li`
  margin: 0 0 0.5em;
  width: 100%;
`;

const SelectButton = styled(Button)`
  width: 100%;
`;

const Empty = styled.div`
  color: ${colors.textLight};
  text-align: center;
  padding: 1em 2em;

  &::before {
    display: block;
    content: url(${iconInfo});
  }
`;

const EmptyTitle = styled.h3`
  font-size: 1em;
  margin: 0 0 0.5em;
`;

const EmptyButton = styled(Button)`
  padding: 0.5em 1em;
`;

const EmptyText = styled.div`
  font-size: 0.9em;
  margin-bottom: 1em;
`;

const NoShortcuts = styled.div`
  padding: 0.5em 1em;
  font-weight: normal;
  font-size: 0.9em;
`;

const buildSuggestions = (section, answers) => {
  const suggestions = validTypes
    .map(type => ({
      suggestionTitle: `${type} answers in this section`,
      suggestionSubtitle: `in ${section.displayName}`,
      answerType: type,
      answers: answers.filter(answer => answer.type === type),
    }))
    .filter(o => o.answers.length > 0);
  return flatten(suggestions);
};

export default class AnswerSelector extends Component {
  state = {
    showPicker: false,
  };

  handleRemoveAnswers(answers) {
    const {
      onUpdateCalculatedSummaryPage,
      page,
      page: { summaryAnswers },
    } = this.props;

    const newSelectedValues = summaryAnswers.filter(
      selectedSummaryAnswer =>
        !find(answers, answer => answer.id === selectedSummaryAnswer.id)
    );

    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: newSelectedValues,
    });
  }

  handlePickerOpen = () => {
    this.setState({ showPicker: true });
  };

  handlePickerClose = () => {
    this.setState({ showPicker: false });
  };

  handlePickerSubmit = answers => {
    const { onUpdateCalculatedSummaryPage, page } = this.props;

    this.setState({ showPicker: false });

    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: answers,
    });
  };

  handleSuggestionSelect = answerIds => {
    const {
      onUpdateCalculatedSummaryPage,
      page,
      page: { summaryAnswers },
    } = this.props;

    onUpdateCalculatedSummaryPage({
      id: page.id,
      summaryAnswers: [...summaryAnswers, ...answerIds],
    });
  };

  renderAnswers(answers, answerType) {
    const { section } = this.props.page;
    return (
      <div>
        <SectionList>
          <SectionListItem key={section.id}>
            <SectionHeader>
              <SectionTitle>
                {answerType} answers in {section.displayName}
              </SectionTitle>
              <RemoveAllButton
                data-test="remove-all"
                onClick={() => {
                  this.handleRemoveAnswers(answers);
                }}
              >
                Remove all
              </RemoveAllButton>
            </SectionHeader>
            <TransitionGroup component={AnswerList}>
              {answers.map(answer => (
                <FadeTransition key={answer.id}>
                  <AnswerListItem>
                    <AnswerChip
                      onRemove={() => this.handleRemoveAnswers([answer])}
                    >
                      <div css={{ fontWeight: "normal" }}>
                        {answer.displayName}
                      </div>

                      <div css={{ fontSize: "0.8em" }}>
                        {answer.page && answer.page.displayName}
                      </div>
                    </AnswerChip>
                  </AnswerListItem>
                </FadeTransition>
              ))}
            </TransitionGroup>
          </SectionListItem>
        </SectionList>
        <SelectButton
          variant="secondary"
          onClick={this.handlePickerOpen}
          data-test="answer-selector"
        >
          Select {(answerType || "answer").toLowerCase()} answer/s
        </SelectButton>
      </div>
    );
  }

  renderNoAnswers = () => {
    return (
      <Empty>
        <EmptyTitle>No numeric answers in this section</EmptyTitle>
        <EmptyText>
          A calculated summary can only be used with numeric answers <br />
          (currency, percentage or number)
        </EmptyText>
      </Empty>
    );
  };

  render() {
    const {
      page: { summaryAnswers, availableSummaryAnswers, section },
    } = this.props;

    let answerType;
    if (summaryAnswers.length > 0) {
      answerType = summaryAnswers[0].type;
    }

    const suggestions = buildSuggestions(section, availableSummaryAnswers);
    const answerIsNumeric = answer => validTypes.indexOf(answer.type) > -1;
    const getNumericAnswerInPage = page =>
      filter(page.answers, answerIsNumeric);

    const numericAnswersInSection = filter(
      section.pages,
      getNumericAnswerInPage
    );

    return (
      <div>
        <Box>
          <Answers>
            {numericAnswersInSection.length < 1 ? (
              this.renderNoAnswers()
            ) : summaryAnswers.length > 0 ? (
              this.renderAnswers(summaryAnswers, answerType)
            ) : (
              <div>
                <Empty>
                  <EmptyTitle>No answers selected</EmptyTitle>
                  <EmptyText>
                    Select an answer using the button below or use the shortcuts
                    for common selections.
                  </EmptyText>
                  <EmptyButton
                    small
                    onClick={this.handlePickerOpen}
                    data-test="answer-selector-empty"
                  >
                    Select an answer
                  </EmptyButton>
                </Empty>
              </div>
            )}

            {!isEmpty(availableSummaryAnswers) && (
              <Suggestions>
                <SuggestionsHeader>
                  <SuggestionsTitle>Shortcuts</SuggestionsTitle>
                </SuggestionsHeader>
                {suggestions.length > 0 ? (
                  <SuggestionsList>
                    {suggestions.map((suggestion, index) => (
                      <SuggestionsListItem suggestion={suggestion} key={index}>
                        <SuggestionButton
                          onClick={() => {
                            this.handleSuggestionSelect(suggestion.answers);
                          }}
                          id={index}
                          data-test={`${suggestion.answers[0].type}-suggestion`}
                        >
                          <SuggestionText>
                            <SuggestionTitle>
                              {suggestion.suggestionTitle}
                            </SuggestionTitle>
                            <SuggestionSubtitle>
                              {suggestion.suggestionSubtitle}
                            </SuggestionSubtitle>
                          </SuggestionText>
                          <SuggestionAnswers>
                            {suggestion.answers.length} answers
                          </SuggestionAnswers>
                        </SuggestionButton>
                      </SuggestionsListItem>
                    ))}
                  </SuggestionsList>
                ) : (
                  <NoShortcuts>
                    No shortcuts available. Add numeric answers to be provided
                    with suggested selections.
                  </NoShortcuts>
                )}
              </Suggestions>
            )}
            {this.state.showPicker && (
              <ContentPickerModal
                isOpen={this.state.showPicker}
                onClose={this.handlePickerClose}
                onSubmit={this.handlePickerSubmit}
                selectedObjs={summaryAnswers}
                validTypes={validTypes}
                answerData={[
                  {
                    ...section,
                    pages: section.pages.filter(page => page.answers),
                  },
                ]}
                multiselect
              />
            )}
          </Answers>
        </Box>
      </div>
    );
  }
}

AnswerSelector.fragments = {
  AnswerSelector: gql`
    fragment AnswerSelector on CalculatedSummaryPage {
      id
      section {
        id
        displayName
        pages {
          id
          displayName
          ... on QuestionPage {
            answers {
              id
              displayName
              type
              page {
                id
                displayName
              }
            }
          }
        }
      }
      summaryAnswers {
        id
        displayName
        type
        page {
          id
          displayName
        }
      }
      availableSummaryAnswers {
        id
        displayName
        type
        page {
          id
          displayName
        }
      }
    }
  `,
};

AnswerSelector.propTypes = {
  onUpdateCalculatedSummaryPage: PropTypes.func.isRequired,
  page: propType(AnswerSelector.fragments.AnswerSelector),
};
