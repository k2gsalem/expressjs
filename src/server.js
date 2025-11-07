const http = require('http');
const jwt = require('jsonwebtoken');
const detectPortModule = require('detect-port');
const app = require('./app');
const env = require('./config');
const connectWithRetry = require('./config/database');
const { initSocket } = require('./utils/socket');
const logger = require('./utils/logger');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const detectPort =
  typeof detectPortModule === 'function' ? detectPortModule : detectPortModule.default;

const resolvePort = async (preferredPort) => {
  try {
    const availablePort = await detectPort(preferredPort);
    if (availablePort !== preferredPort) {
      logger.warn(
        `Port ${preferredPort} is already in use. Falling back to available port ${availablePort}.`,
      );
    }
    return availablePort;
  } catch (error) {
    logger.error(`Unable to determine an available port: ${error.message}`);
    throw error;
  }
};

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

  const preferredPort = Number(env.port) || 3000;
  const port = await resolvePort(preferredPort);
  process.env.PORT = port;

  server.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    logger.error(`Server error: ${error.message}`);
    process.exit(1);
  });
};

startServer();
