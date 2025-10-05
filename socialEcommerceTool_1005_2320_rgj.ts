// 代码生成时间: 2025-10-05 23:20:39
import { ApolloServer } from 'apollo-server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import mongoose from 'mongoose';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// Define a model for User
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

// Create a User model from the schema
const User = mongoose.model('User', UserSchema);

// Define a model for Post
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Create a Post model from the schema
const Post = mongoose.model('Post', PostSchema);

// Define the Apollo server instance
const server = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs, resolvers }),
  context: () => ({
    User,
    Post
  }),
});

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/socialEcommerceDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Start the Apollo server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

/*
 * The schema and resolvers are split into separate files for better organization and clarity.
 * schema.ts would contain GraphQL type definitions.
 * resolvers.ts would contain the logic to resolve those types.
 */
