import { ApolloClient } from "apollo-client";
import { resolvers, typeDefs } from "./resolvers";

export default (link, cache) => {
  cache.writeData({
    data: {
      newPageId: "",
    },
  });
  console.log("cachinit", cache);

  return new ApolloClient({
    link,
    cache,
    typeDefs,
    resolvers,
    connectToDevTools: process.env.NODE_ENV === "development",
  });
};
