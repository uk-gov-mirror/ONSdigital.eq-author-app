const { findIndex, merge } = require("lodash");

const { availableRoutingDestinations } = require("../../../src/businessLogic");
const { getName } = require("../../../utils/getName");
const { v4: uuidv4 } = require("uuid");

const {
  getPages,
  getPageById,
  getSectionByPageId,
  getSectionById,
} = require("../utils");
const { createMutation } = require("../createMutation");

const {
  ROUTING_ANSWER_TYPES,
} = require("../../../constants/routingAnswerTypes");

const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");
const Resolvers = {};

const createQuestionPage = (input = {}) => {
  const a = {
    id: uuidv4(),
    pageType: "QuestionPage",
    title: "",
    description: "",
    descriptionEnabled: false,
    guidanceEnabled: false,
    definitionEnabled: false,
    additionalInfoEnabled: false,
    answers: [],
    routing: null,
    alias: null,
    ...input,
  };

  return a;
};

Resolvers.QuestionPage = {
  section: ({ id }, input, ctx) => getSectionByPageId(ctx, id),
  position: ({ id }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);
    return findIndex(getPages(section), { id });
  },
  displayName: page => getName(page, "QuestionPage"),
  availablePipingAnswers: ({ id }, args, ctx) =>
    getPreviousAnswersForPage(ctx.questionnaire, id),
  availablePipingMetadata: (page, args, ctx) => ctx.questionnaire.metadata,
  availableRoutingAnswers: (page, args, ctx) =>
    getPreviousAnswersForPage(
      ctx.questionnaire,
      page.id,
      true,
      ROUTING_ANSWER_TYPES
    ),
  availableRoutingDestinations: ({ id }, args, ctx) => {
    const {
      logicalDestinations,
      sections,
      questionPages,
    } = availableRoutingDestinations(ctx, id);

    return {
      logicalDestinations,
      sections,
      pages: questionPages,
    };
  },
  validationErrorInfo: ({ id }, args, ctx) => {
    const pageErrors = ctx.validationErrorInfo.filter(
      ({ pageId }) => id === pageId
    );

    if (!pageErrors) {
      return { id, errors: [], totalCount: 0 };
    }

    return { id, errors: pageErrors, totalCount: pageErrors.length };
  },
};

Resolvers.Mutation = {
  createQuestionPage: createMutation(
    (root, { input: { position, ...pageInput } }, ctx) => {
      const section = getSectionById(ctx, pageInput.sectionId);
      const page = createQuestionPage(pageInput);
      const insertionPosition =
        typeof position === "number" ? position : getPages(section).length;
      getPages(section).splice(insertionPosition, 0, page);
      return page;
    }
  ),
  updateQuestionPage: createMutation((_, { input }, ctx) => {
    const page = getPageById(ctx, input.id);
    merge(page, input);
    return page;
  }),
};

module.exports = { Resolvers, createQuestionPage };
