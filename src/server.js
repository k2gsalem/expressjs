const http = require('http');
const jwt = require('jsonwebtoken');
const app = require('./app');
const env = require('./config');
const connectWithRetry = require('./config/database');
const { initSocket } = require('./utils/socket');
const logger = require('./utils/logger');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const startServer = async () => {
  await connectWithRetry();

  const server = http.createServer(app);
  initSocket(server);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, env.jwt.secret);
          return { user: decoded };
        } catch (error) {
          return {};
        }
      }
      return {};
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  server.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
  });
};

startServer();
