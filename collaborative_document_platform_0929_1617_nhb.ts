// 代码生成时间: 2025-09-29 16:17:17
import { ApolloServer, gql } from 'apollo-server';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { PubSub } from 'graphql-subscriptions';
import { Document } from './models/Document';
import { DocumentChange } from './models/DocumentChange';

// Define the GraphQL schema.
const typeDefs = gql`
  type Query {
    document(id: ID!): Document
  }

  type Mutation {
    createDocument(title: String!): Document
    updateDocument(id: ID!, content: String!): Document
  }

  type Subscription {
    documentUpdated(id: ID!): DocumentChange
  }

  type Document {
    id: ID!
    title: String!
    content: String
  }

  type DocumentChange {
    id: ID!
    content: String
  }
`;

// Define the resolvers.
const resolvers = {
  Query: {
    document: async (_, { id }) => {
      // Retrieve the document from the database.
      return Document.findById(id);
    },
  },
  Mutation: {
    createDocument: async (_, { title }) => {
      // Create a new document.
      const newDocument = new Document({ title });
      await newDocument.save();
      return newDocument;
    },
    updateDocument: async (_, { id, content }) => {
      // Update the content of a document.
      const updatedDocument = await Document.findByIdAndUpdate(id, { content }, { new: true });
      if (!updatedDocument) {
        throw new Error('Document not found');
      }
      return updatedDocument;
    },
  },
  Subscription: {
    documentUpdated: {
      subscribe: (_, { id }, { pubsub }) => pubsub.asyncIterator(`DOCUMENT_UPDATED_${id}`),
      resolve: (payload) => payload,
    },
  },
};

// Define the PubSub instance.
const pubsub = new PubSub();

// Define the ApolloServer options.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: new InMemoryLRUCache(),
  context: ({ req }) => {
    // Add authentication context here, if needed.
    return {
      user: req.user,
      pubsub,
    };
  },
  formatError: (error) => {
    // Custom error formatting.
    if (error.originalError) {
      return error.originalError;
    }
    return error;
  },
});

// Start the server.
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

// Document model for MongoDB.
class Document {
  id: string;
  title: string;
  content?: string;
  constructor(data: any) {
    this.id = data._id;
    this.title = data.title;
    this.content = data.content;
  }
  // More methods to interact with the database can be added here.
}

// DocumentChange model for real-time updates.
class DocumentChange {
  id: string;
  content?: string;
  constructor(data: any) {
    this.id = data._id;
    this.content = data.content;
  }
  // Methods to handle document change events can be added here.
}
