// 代码生成时间: 2025-10-07 23:21:36
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import { buildSubgraphSchema } from '@apollo/subgraph';

// Define the type definitions for the schema
const typeDefs = gql\`
  type Query {
    getAllStudents: [Student]
    getStudentById(id: ID!): Student
  }
  type Student {
    id: ID!
    name: String
    age: Int
    grade: String
  }
\`;

// Mock data for students
const students = [
  { id: '1', name: 'Alice', age: 20, grade: 'Sophomore' },
  { id: '2', name: 'Bob', age: 21, grade: 'Junior' },
  { id: '3', name: 'Charlie', age: 22, grade: 'Senior' }
];

// Resolvers define the technique for fetching the types in the schema
const resolvers = {
  Query: {
    getAllStudents: () => students,
    getStudentById: (_, { id }) => students.find(student => student.id === id),
  },
};

// Create an instance of ApolloServer with type definitions and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Initialize express and attach the ApolloServer middleware
const app = express();
server.applyMiddleware({ app });

// Start the server and listen on port 4000
app.listen({ port: 4000 }, () => {
  console.log('🚀 Server ready at http://localhost:4000$$');
});

/*
 * Error Handling
 * The ApolloServer provides built-in error handling.
 * If a resolver function throws an error,
 * ApolloServer will catch it and return a formatted error response.
 * You can further enhance error handling by providing a formatError function.
 */

/*
 * Code Maintainability and Extensibility
 * - The code is structured into separate sections for type definitions, resolvers, and server setup.
 * - Comments and documentation are provided to explain the functionality.
 * - The use of TypeScript ensures type safety and easier refactoring.
 * - The ApolloServer setup allows for easy extension with additional GraphQL features.
 */