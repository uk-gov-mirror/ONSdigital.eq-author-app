const Answer = require("./Answer");
const { parseGuidance, getInnerHTMLWithPiping } = require("../utils/HTMLUtils");
const { find, get, flow, isNil, assign, concat } = require("lodash/fp");
const convertPipes = require("../utils/convertPipes");

const findDateRange = flow(
  get("answers"),
  find({ type: "DateRange" })
);

const findMutuallyExclusive = flow(
  get("answers"),
  find(answer => !isNil(get("mutuallyExclusiveOption", answer)))
);

const processPipedText = ctx =>
  flow(
    convertPipes(ctx),
    getInnerHTMLWithPiping
  );
const processGuidance = ctx =>
  flow(
    convertPipes(ctx),
    parseGuidance
  );

class Question {
  constructor(question, ctx) {
    this.id = `question${question.id}`;
    this.title = processPipedText(ctx)(question.title);
    this.guidance = processGuidance(ctx)(question.guidance);
    this.description = processPipedText(ctx)(question.description);

    const dateRange = findDateRange(question);

    const mutuallyExclusive = findMutuallyExclusive(question);

    if (dateRange) {
      this.type = "DateRange";
      this.answers = this.buildDateRangeAnswers(dateRange);

      const { earliestDate, latestDate } = dateRange.validation;
      if (earliestDate.enabled || latestDate.enabled) {
        this.answers[0].minimum = Answer.buildDateValidation(earliestDate);
        this.answers[1].maximum = Answer.buildDateValidation(latestDate);
      }
    } else if (mutuallyExclusive) {
      this.type = "MutuallyExclusive";
      this.mandatory = get("properties.required", mutuallyExclusive);
      this.answers = this.buildMutuallyExclusiveAnswers(mutuallyExclusive);
    } else {
      this.type = "General";
      this.answers = this.buildAnswers(question.answers);
    }
  }

  buildAnswers(answers) {
    return answers.map(answer => new Answer(answer));
  }

  buildDateRangeAnswers(answer) {
    return answer.childAnswers.map(
      childAnswer =>
        new Answer(
          assign(childAnswer, { type: "Date", properties: answer.properties })
        )
    );
  }

  buildMutuallyExclusiveAnswers(mutuallyExclusive) {
    Object.assign(mutuallyExclusive.properties, { required: false });
    const mutuallyExclusiveAnswer = new Answer({
      ...mutuallyExclusive,
      id: `${mutuallyExclusive.id}-exclusive`,
      type: "Checkbox",
      options: [mutuallyExclusive.mutuallyExclusiveOption]
    });

    return concat(
      this.buildAnswers([mutuallyExclusive]),
      mutuallyExclusiveAnswer
    );
  }
}

module.exports = Question;
