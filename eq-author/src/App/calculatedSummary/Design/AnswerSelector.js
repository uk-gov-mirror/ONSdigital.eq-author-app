import React, { Component } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import AnswerChip from "./AnswerChip";
import { TransitionGroup } from "react-transition-group";
import FadeTransition from "components/transitions/FadeTransition";
import ContentPickerModal from "components/ContentPickerModal";
import {
  flatMap,
  find,
  intersectionBy,
  get,
  sortBy,
  filter,
  reverse,
  differenceBy
} from "lodash";

import { ANSWER } from "components/ContentPickerSelect/content-types";
import Button from "components/buttons/Button";

import iconInfo from "./icon-info.svg";
import { CURRENCY, NUMBER, PERCENTAGE } from "constants/answer-types";

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

const SuggestionsTitle = styled.h2`
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

const SuggestionButton = styled.button`
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

const TextButton = styled.button`
  appearance: none;
  border: none;
  font-size: 0.85rem;
  letter-spacing: 0.05rem;
  margin: 0 0.5em;
  color: ${colors.primary};
  background: transparent;
  font-weight: bold;
  text-transform: uppercase;

  &:focus {
    outline: none;
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }
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

const RemoveAllButton = styled(TextButton)`
  border: none;
  font-size: 0.8rem;
  margin: 0 0 0 auto;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  font-size: 0.9em;
  color: #807d77;
`;

const AnswerList = styled.ul`
  list-style: none;
  margin: 0 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`;

const AnswerListItem = styled.li`
  margin: 0 0 0.5em 0;
  width: 100%;
`;

const SelectButton = styled(Button)`
  width: 100%;
`;

const Empty = styled.div`
  color: #7a7a7a;
  text-align: center;
  padding: 1em 2em 2em;

  &::before {
    display: block;
    content: url(${iconInfo});
  }
`;

const EmptyTitle = styled.h2`
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

const getSuggestions = props => {
  const { suggestions, answers, answerType } = props;

  const filterSelected = suggestedAnswers =>
    differenceBy(suggestedAnswers, answers, "id");

  const {
    currentSection,
    currencyAnswersinCurrentSection,
    numberAnswersinCurrentSection,
    percentageAnswersinCurrentSection,
    previousSection,
    currencyAnswersinPreviousSection,
    numberAnswersinPreviousSection,
    percentageAnswersinPreviousSection,
    allPreviousCurrencyAnswers
  } = suggestions;

  let options = [
    {
      type: CURRENCY,
      title: "Currency answers in this section",
      subTitle: `in ${currentSection.displayName}`,
      answers: filterSelected(currencyAnswersinCurrentSection)
    },
    {
      type: NUMBER,
      title: "Number answers in this section",
      subTitle: `in ${currentSection.displayName}`,
      answers: filterSelected(numberAnswersinCurrentSection)
    },
    {
      type: PERCENTAGE,
      title: "Percentage answers in this section",
      subTitle: `in ${currentSection.displayName}`,
      answers: filterSelected(percentageAnswersinCurrentSection)
    },

    {
      type: CURRENCY,
      title: "All previous currency answers",
      subTitle: `in whole survey`,
      answers: filterSelected(allPreviousCurrencyAnswers)
    }
  ];

  if (previousSection) {
    options = options.concat([
      {
        type: CURRENCY,
        title: "Currency answers in previous section",
        subTitle: `in ${previousSection.displayName}`,
        answers: filterSelected(currencyAnswersinPreviousSection)
      },
      {
        type: NUMBER,
        title: "Number answers in previous section",
        subTitle: `in ${previousSection.displayName}`,
        answers: filterSelected(numberAnswersinPreviousSection)
      },
      {
        type: PERCENTAGE,
        title: "Percentage answers in previous section",
        subTitle: `in ${previousSection.displayName}`,
        answers: filterSelected(percentageAnswersinPreviousSection)
      }
    ]);
  }

  return reverse(
    sortBy(
      filter(filter(options, ({ answers }) => answers.length > 1), ({ type }) =>
        answerType ? type === answerType : true
      ),
      ({ answers }) => answers.length
    )
  );
};

export default class AnswerSelector extends Component {
  state = {
    suggestions: [],
    showPicker: false
  };

  constructor(props) {
    super(props);
    this.state.suggestions = getSuggestions(this.props);
  }

  componentWillReceiveProps = nextProps => {
    this.setState({
      suggestions: getSuggestions(nextProps)
    });

    return nextProps;
  };

  handlePickerOpen = () => {
    this.setState({ showPicker: true });
  };

  handlePickerClose = () => {
    this.setState({ showPicker: false });
  };

  handlePickerSubmit = ({ id }) => {
    this.setState({ showPicker: false });

    this.props.addAnswer(
      find(flatMap(flatMap(this.props.previousSections, "pages"), "answers"), {
        id
      })
    );
  };

  handleSuggestionClick = e => {
    this.props.addAnswers(this.state.suggestions[e.currentTarget.id].answers);
  };

  render() {
    const {
      answers,
      removeAnswer,
      removeAnswers,
      previousSections,
      answerType
    } = this.props;

    const { showPicker, suggestions } = this.state;
    const answerData = previousSections;

    return (
      <div>
        <Box>
          <Answers>
            {answers.length > 0 ? (
              <div>
                <SectionList>
                  {previousSections.map((section, index) => {
                    const answersInThisSection = intersectionBy(
                      flatMap(section.pages, page => page.answers),
                      answers,
                      "id"
                    );
                    if (answersInThisSection.length > 0) {
                      return (
                        <SectionListItem key={section.id}>
                          <SectionHeader>
                            <SectionTitle>
                              {answerType} answers in {section.displayName}
                            </SectionTitle>
                            {index > -1 && (
                              <RemoveAllButton onClick={removeAnswers}>
                                Remove all
                              </RemoveAllButton>
                            )}
                          </SectionHeader>
                          <TransitionGroup component={AnswerList}>
                            {answersInThisSection.map(answer => (
                              <FadeTransition key={answer.id}>
                                <AnswerListItem>
                                  <AnswerChip
                                    onRemove={() => removeAnswer(answer)}
                                  >
                                    {answer.label}
                                  </AnswerChip>
                                </AnswerListItem>
                              </FadeTransition>
                            ))}
                          </TransitionGroup>
                        </SectionListItem>
                      );
                    }
                  })}
                </SectionList>
                <SelectButton
                  variant="secondary"
                  onClick={this.handlePickerOpen}
                >
                  Select another {(answerType || "answer").toLowerCase()} answer
                </SelectButton>
              </div>
            ) : (
              <div>
                <Empty>
                  <EmptyTitle>No answers selected</EmptyTitle>
                  <EmptyText>
                    Select an answer using the button below or use the shortcuts
                    for common selections.
                  </EmptyText>
                  <EmptyButton small onClick={this.handlePickerOpen}>
                    Select an answer
                  </EmptyButton>
                </Empty>
              </div>
            )}

            <Suggestions>
              <SuggestionsHeader>
                <SuggestionsTitle>Shortcuts</SuggestionsTitle>
              </SuggestionsHeader>
              {suggestions.length > 0 ? (
                <TransitionGroup component={SuggestionsList}>
                  {suggestions.map((suggestion, index) => (
                    <FadeTransition key={index}>
                      <SuggestionsListItem suggestion={suggestion} key={index}>
                        <SuggestionButton
                          onClick={this.handleSuggestionClick}
                          id={index}
                        >
                          <SuggestionText>
                            <SuggestionTitle>
                              {suggestion.title}
                            </SuggestionTitle>
                            <SuggestionSubtitle>
                              {suggestion.subTitle}
                            </SuggestionSubtitle>
                          </SuggestionText>
                          <SuggestionAnswers>
                            {suggestion.answers.length} answers
                          </SuggestionAnswers>
                        </SuggestionButton>
                      </SuggestionsListItem>
                    </FadeTransition>
                  ))}
                </TransitionGroup>
              ) : (
                <div
                  css={{
                    padding: "0.5em 1em",
                    "font-weight": "normal",
                    "font-size": "0.9em"
                  }}
                >
                  No shortcuts available. Add numeric answers to be provided
                  with suggested selections.
                </div>
              )}
            </Suggestions>

            <ContentPickerModal
              isOpen={showPicker}
              onClose={this.handlePickerClose}
              onSubmit={this.handlePickerSubmit}
              answerData={answerData}
              contentTypes={[ANSWER]}
            />
          </Answers>
        </Box>
      </div>
    );
  }
}
