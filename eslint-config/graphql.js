const schema = require("../eq-author-api/schema/typeDefs");

module.exports = {
  plugins: ["graphql"],
  rules: {
    "graphql/template-strings": [
      "error",
      {
        env: "literal",
        schemaString: schema,
      },
    ],
  },
};
