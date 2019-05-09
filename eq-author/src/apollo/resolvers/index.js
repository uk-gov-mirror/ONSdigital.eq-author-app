import gql from "graphql-tag";

export const typeDefs = gql`
  extend type QuestionPage {
    isNew: Boolean!
  }

  extend type Mutation {
    createQuestionPage: QuestionPage
  }
`;

const GET_NEW_PAGE_ID = gql`
  query newPageId {
    newPageId @client
  }
`;

export const resolvers = {
  QuestionPage: {
    isNew: (questionPage, _, { cache }) => {
      const { newPageId } = cache.readQuery({ query: GET_NEW_PAGE_ID });
      if (newPageId && questionPage.id !== newPageId) {
        // Reset new page id
        cache.writeData({ data: { newPageId: "" } });
      }
      console.log("isNew", questionPage.id === newPageId);
      return questionPage.id === newPageId;
    },
  },

  Mutation: {
    createQuestionPage: (_, input, { cache }) => {
      cache.writeData({ data: { newPageId: _.createQuestionPage.id } });
      console.log("createQuestion", _.createQuestionPage.id, cache);
    },
  },
};
