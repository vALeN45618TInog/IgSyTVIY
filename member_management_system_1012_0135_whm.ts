// 代码生成时间: 2025-10-12 01:35:29
import { ApolloServer, gql } from 'apollo-server';
import { Member } from './entities/Member';
import { MemberService } from './services/MemberService';

// Define the GraphQL schema
const typeDefs = gql`
  type Member {
    id: ID!
    name: String!
    email: String!
    joinedDate: String!
  }

  type Query {
    getMembers: [Member]
    getMemberById(id: ID!): Member
  }

  type Mutation {
    addMember(name: String!, email: String!): Member
    updateMember(id: ID!, name: String, email: String): Member
    deleteMember(id: ID!): Boolean
  }
`;

// Define the resolvers
const resolvers = {
  Query: {
    getMembers: async (_, __, { memberService }) => {
      try {
        return await memberService.findAll();
      } catch (error) {
        throw new Error('Failed to retrieve members');
      }
    },
    getMemberById: async (_, { id }, { memberService }) => {
      try {
        return await memberService.findById(id);
      } catch (error) {
        throw new Error('Failed to retrieve member by ID');
      }
    },
  },
  Mutation: {
    addMember: async (_, { name, email }, { memberService }) => {
      try {
        return await memberService.create({ name, email });
      } catch (error) {
        throw new Error('Failed to add member');
      }
    },
    updateMember: async (_, { id, name, email }, { memberService }) => {
      try {
        return await memberService.update(id, { name, email });
      } catch (error) {
        throw new Error('Failed to update member');
      }
    },
    deleteMember: async (_, { id }, { memberService }) => {
      try {
        return await memberService.delete(id);
      } catch (error) {
        throw new Error('Failed to delete member');
      }
    },
  },
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    memberService: new MemberService(), // Inject the service into the context
  },
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

// Export the Member entity for use in other parts of the application
export { Member };
