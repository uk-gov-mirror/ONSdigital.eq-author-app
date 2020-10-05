const { findIndex, remove, omit, set, first } = require("lodash");

const {
  getPages,
  getSectionByPageId,
  remapAllNestedIds,
  getSectionById,
  getPageById,
} = require("../utils");

const onPageDeleted = require("../../../src/businessLogic/onPageDeleted");
const { createMutation } = require("../createMutation");
const addPrefix = require("../../../utils/addPrefix");
const { createQuestionPage } = require("./questionPage");

const Resolvers = {};

Resolvers.Page = {
  __resolveType: ({ pageType }) => pageType,
  position: ({ id }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);
    return findIndex(getPages(section), { id });
  },
};

Resolvers.Mutation = {
  movePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const removedPage = first(remove(getPages(section), { id: input.id }));
    if (input.sectionId === section.id) {
      getPages(section).splice(input.position, 0, removedPage);
    } else {
      const newsection = getSectionById(input.sectionId);
      // const newsection = find(ctx.questionnaire.sections, {
      //   id: input.sectionId,
      // });

      getPages(newsection).splice(input.position, 0, removedPage);
    }
    return removedPage;
  }),
  deletePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const removedPage = first(remove(getPages(section), { id: input.id }));
    onPageDeleted(ctx, section, removedPage);

    return section;
  }),

  duplicatePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    // const page = find(section.pages, { id: input.id });
    const page = getPageById(section, input.id);
    const newpage = omit(page, "id");
    set(newpage, "alias", addPrefix(newpage.alias));
    set(newpage, "title", addPrefix(newpage.title));
    const duplicatedPage = createQuestionPage(newpage);
    const remappedPage = remapAllNestedIds(duplicatedPage);
    getPages(section).splice(input.position, 0, remappedPage);
    return remappedPage;
  }),
};

module.exports = [
  Resolvers,
  require("./questionPage").Resolvers,
  require("./calculatedSummaryPage").Resolvers,
];
