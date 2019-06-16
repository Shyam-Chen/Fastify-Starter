import { ApolloServer } from 'apollo-server-fastify';
import { mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import helloWorld from '~/hello-world/graphql';

const typeDefs = mergeTypes([
  helloWorld.typeDefs,
], { all: true });

const resolvers = mergeResolvers([
  helloWorld.resolvers,
]);

// const context = async ({ req }) => {
//   const token = req.headers['Authorization'];
//   return { token, user };
// };

export default new ApolloServer({ typeDefs, resolvers });
