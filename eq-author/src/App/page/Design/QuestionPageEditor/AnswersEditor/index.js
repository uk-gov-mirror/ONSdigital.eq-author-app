import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import Reorder from "components/Reorder";

import withMoveAnswer from "./withMoveAnswer";
import AnswerTransition from "./AnswerTransition";
import AnswerEditor from "./AnswerEditor";

const currentAnswersReducer = (accumulator, answer) => {
  accumulator[answer.id] = true;
  return accumulator;
};
class AnswersEditor extends React.Component {
  currentAnswers = this.props.answers.reduce(currentAnswersReducer, {});

  isNewAnswer = answerId => {
    return !this.currentAnswers[answerId];
  };

  componentDidUpdate(prevProps) {
    if (this.props.answers.length !== prevProps.answers.length) {
      this.currentAnswers = this.props.answers.reduce(
        currentAnswersReducer,
        {}
      );
    }
  }

  render() {
    const {
      answers,
      onUpdate,
      onAddOption,
      onUpdateOption,
      onDeleteOption,
      onAddExclusive,
      onDeleteAnswer,
      moveAnswer,
    } = this.props;
    console.log({ answers }, this.currentAnswers);
    return (
      <Reorder list={answers} onMove={moveAnswer} Transition={AnswerTransition}>
        {(props, answer) => {
          return (
            <AnswerEditor
              {...props}
              answer={answer}
              onUpdate={onUpdate}
              onAddOption={onAddOption}
              onAddExclusive={onAddExclusive}
              onUpdateOption={onUpdateOption}
              onDeleteOption={onDeleteOption}
              onDeleteAnswer={onDeleteAnswer}
              isNewAnswer={this.isNewAnswer(answer.id)}
            />
          );
        }}
      </Reorder>
    );
  }
}

AnswersEditor.propTypes = {
  answers: PropTypes.arrayOf(propType(AnswerEditor.fragments.AnswerEditor))
    .isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onUpdateOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
  onAddExclusive: PropTypes.func.isRequired,
  onDeleteAnswer: PropTypes.func.isRequired,
  moveAnswer: PropTypes.func.isRequired,
};

AnswersEditor.fragments = {
  AnswersEditor: AnswerEditor.fragments.AnswerEditor,
};

export default withMoveAnswer(AnswersEditor);
