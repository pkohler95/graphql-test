import { gql, ApolloServer } from 'apollo-server-micro';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const typeDefs = gql`
  type BlogPost {
    id: String
    text: String
    imageUrl: String
  }

  type Query {
    blogPosts: [BlogPost]
  }

  type Mutation {
    addBlogPost(text: String, imageUrl: String): BlogPost
    editBlogPost(id: String, text: String): BlogPost
    deleteBlogPost(id: String): BlogPost
  }
`;

const resolvers = {
  Query: {
    blogPosts: (_parent, _args, _context) => {
      return prisma.blogPost.findMany();
    },
  },

  Mutation: {
    addBlogPost: (_parent, { text, imageUrl }, _context) => {
      return prisma.blogPost.create({ data: { text, imageUrl } });
    },
    editBlogPost: (_parent, { id, text }, _context) => {
      return prisma.blogPost.update({ where: { id }, data: { text } });
    },
    deleteBlogPost: (_parent, { id }, _context) => {
      return prisma.blogPost.delete({ where: { id } });
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = apolloServer.start();

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;

  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};

export const config = {
  api: {
    bodyParser: false,
  },
};
