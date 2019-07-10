//     "eslint-plugin-graphql": "^1.5.0",
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
