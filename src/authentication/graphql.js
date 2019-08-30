import { gql } from 'apollo-server-fastify';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type LoginResponse {
    token: String
    user: User
  }

  type Query {
    user: User!
  }

  type Mutation {
    register(username: String!, password: String!): User!
    login(username: String!, password: String!): LoginResponse!
  }
`;

const resolvers = {
  Query: {
    helloWorld() {
      return 'Hello, World!';
    },
  },
};

export default { typeDefs, resolvers };
