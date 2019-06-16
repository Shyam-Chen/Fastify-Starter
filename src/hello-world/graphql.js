import gql from 'graphql-tag';

const typeDefs = gql`
  type Query {
    helloWorld: String
  }
`;

const resolvers = {
  /**
   * @example query { helloWorld }
   */
  Query: {
    helloWorld() {
      return 'Hello, World!';
    },
  },
};

export default { typeDefs, resolvers };
