const Redis = require('ioredis');
const env = require('./index');
const logger = require('../utils/logger');

let redisClient;

const createMockClient = () => ({
  mocked: true,
  get: async () => null,
  set: async () => null,
});

const getRedisClient = () => {
  if (!env.redisUrl) {
    if (!redisClient) {
      redisClient = createMockClient();
    }
    return redisClient;
  }

  if (!redisClient || redisClient.mocked) {
    redisClient = new Redis(env.redisUrl);

    redisClient.on('error', (error) => {
      logger.error(`Redis error: ${error.message}`);
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });
  }

  return redisClient;
};

module.exports = getRedisClient;
