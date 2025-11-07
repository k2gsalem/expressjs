const logger = require('../utils/logger');
const { errorResponse } = require('../utils/response');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  logger.error(err.stack || err.message);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, message, status, err.errors || []);
};

const notFoundHandler = (req, res) => {
  const message = `Resource not found - ${req.originalUrl}`;
  return errorResponse(res, message, 404);
};

module.exports = { errorHandler, notFoundHandler };
