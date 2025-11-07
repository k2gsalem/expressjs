const mongoose = require('mongoose');
const env = require('./index');
const logger = require('../utils/logger');

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

const connectWithRetry = async (retry = 0) => {
  try {
    await mongoose.connect(env.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    if (retry < MAX_RETRIES) {
      const nextRetry = retry + 1;
      logger.warn(
        `Retrying MongoDB connection (${nextRetry}/${MAX_RETRIES}) in ${RETRY_DELAY_MS / 1000}s`,
      );
      setTimeout(() => connectWithRetry(nextRetry), RETRY_DELAY_MS);
    } else {
      logger.error('Max retries reached. Exiting process.');
      process.exit(1);
    }
  }
};

module.exports = connectWithRetry;
