import { ApolloServer } from 'apollo-server-fastify';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import { HelloWorld } from '~/hello-world';

const typeDefs = mergeTypes(
  [
    HelloWorld.typeDef,
    // ...
  ],
  { all: true },
);

const resolvers = mergeResolvers([
  HelloWorld.resolver,
  // ...
]);

// const context = async ({ req }) => {
//   const token = req.headers['Authorization'];
//   return { token, user };
// };

export default new ApolloServer({ typeDefs, resolvers });
