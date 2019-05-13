import gql from "graphql-tag";

export const typeDefs = gql`
  extend type QuestionPage {
    isNew: Boolean!
  }

  extend type Answer {
    isNew: Boolean!
  }

  extend type Option {
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

const GET_NEW_OPTIONS = gql`
  query newOptions {
    newOptions @client
  }
`;

const isNewAnswer = (answer, _, { cache }) => {
  const { newAnswerId } = cache.readQuery({ query: GET_NEW_ANSWER_ID });

  if (answer.id !== newAnswerId) {
    // Reset new page id
    cache.writeData({
      data: {
        newAnswerId: null,
        newOptions: [],
      },
    });
  }

  return answer.id === newAnswerId;
};

export const resolvers = {
  QuestionPage: {
    isNew: (questionPage, _, { cache }) => {
      const { newPageId } = cache.readQuery({ query: GET_NEW_PAGE_ID });
      if (questionPage.id !== newPageId) {
        // Reset new page id
        cache.writeData({
          data: {
            newPageId: null,
            newAnswerId: null,
            newOptions: [],
          },
        });
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

  Option: {
    isNew: (option, _, { cache }) => {
      const { newOptions } = cache.readQuery({ query: GET_NEW_OPTIONS });
      return newOptions.indexOf(option.id) > -1;
    },
  },

  Mutation: {
    createQuestionPage: (_, input, { cache }) => {
      cache.writeData({ data: { newPageId: _.createQuestionPage.id } });
    },

    createAnswer: (_, input, { cache }) => {
      const newOptions = _.createAnswer.options
        ? _.createAnswer.options.map(option => option.id)
        : [];

      cache.writeData({
        data: {
          newAnswerId: _.createAnswer.id,
          newOptions,
        },
      });
    },

    createOption: (_, input, { cache }) => {
      const { newOptions } = cache.readQuery({ query: GET_NEW_OPTIONS });
      newOptions.push(_.createOption.id);
      cache.writeData({
        data: { newOptions },
      });
    },

    updateOption: (_, input, { cache }) => {
      const { newOptions } = cache.readQuery({ query: GET_NEW_OPTIONS });

      cache.writeData({
        data: {
          newOptions: newOptions.filter(
            optionId => optionId !== _.updateOption.id
          ),
        },
      });
    },
  },
};
