const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const env = require('./config');
const routes = require('./routes');
const requestLogger = require('./middlewares/requestLogger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const swaggerConfig = require('./docs/swagger');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!env.cors.allowedOrigins.length || env.cors.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: env.cors.allowedMethods,
};
app.use(cors(corsOptions));

app.use(requestLogger);

const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
});
app.use(limiter);

if (env.swaggerEnabled) {
  const swaggerSpec = swaggerJsdoc(swaggerConfig);
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use('/api', routes);

app.use('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
