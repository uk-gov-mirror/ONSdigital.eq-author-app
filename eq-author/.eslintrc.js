const path = require("path");

module.exports = {
  extends: [
    "../eslint-config/index.js",
    "../eslint-config/react.js",
    "../eslint-config/graphql.js",
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
