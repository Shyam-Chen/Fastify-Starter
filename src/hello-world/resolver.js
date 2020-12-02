import { gql } from 'apollo-server-fastify';

export const typeDef = gql`
  type Query {
    helloWorld: String
  }
`;

export default {
  /**
   * @example query { helloWorld }
   */
  Query: {
    helloWorld() {
      return 'Hello, World!';
    },
  },
};
