const path = require("path");

module.exports = {
  extends: [
    "../eslint-config",
    "../eslint-config/react",
    "../eslint-config/graphql",
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
