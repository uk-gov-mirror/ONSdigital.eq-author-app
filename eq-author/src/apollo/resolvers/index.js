import gql from "graphql-tag";

export const typeDefs = gql`
  extend type QuestionPage {
    isNew: Boolean!
  }

  extend type Answer {
    isNew: Boolean!
  }

  extend type Mutation {
    createQuestionPage: QuestionPage
    createAnswer: Answer
  }
`;

const GET_NEW_PAGE_ID = gql`
  query newPageId {
    newPageId @client
  }
`;

const GET_NEW_ANSWER_ID = gql`
  query newAnswerId {
    newAnswerId @client
  }
`;

const isNewAnswer = (answer, _, { cache }) => {
  const { newAnswerId } = cache.readQuery({ query: GET_NEW_ANSWER_ID });
  if (newAnswerId && answer.id !== newAnswerId) {
    // Reset new page id
    cache.writeData({ data: { newAnswerId: null } });
  }
  return answer.id === newAnswerId;
};

export const resolvers = {
  QuestionPage: {
    isNew: (questionPage, _, { cache }) => {
      const { newPageId } = cache.readQuery({ query: GET_NEW_PAGE_ID });
      if (newPageId && questionPage.id !== newPageId) {
        // Reset new page id
        cache.writeData({ data: { newPageId: "" } });
      }
      return questionPage.id === newPageId;
    },
  },

  BasicAnswer: {
    isNew: isNewAnswer,
  },

  MultipleChoiceAnswer: {
    isNew: isNewAnswer,
  },

  Mutation: {
    createQuestionPage: (_, input, { cache }) => {
      cache.writeData({ data: { newPageId: _.createQuestionPage.id } });
    },

    createAnswer: (_, input, { cache, getCacheKey }) => {
      cache.writeData({ data: { newAnswerId: _.createAnswer.id } });
    },
  },
};
