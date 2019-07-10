const path = require("path");
const schema = require("../eq-author-api/schema/typeDefs");

module.exports = {
  extends: [
    "eslint-config-eq-author",
    "eslint-config-eq-author/react",
    "eslint-config-eq-author/graphql",
  ],
  settings: {
    react: {
      version: "latest",
    },
    "import/resolver": {
      webpack: {
        config: {
          resolve: {
            modules: [
              path.resolve(__dirname, "src"),
              path.resolve(__dirname, "node_modules"),
            ],
          },
        },
      },
    },
  },
};
