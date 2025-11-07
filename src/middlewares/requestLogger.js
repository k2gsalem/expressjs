const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const { method, originalUrl } = req;
    const { statusCode } = res;
    const duration = Date.now() - start;
    logger.info(`${method} ${originalUrl} ${statusCode} ${duration}ms`);
  });
  next();
};

module.exports = requestLogger;
