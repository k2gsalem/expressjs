const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  mongoUri:
    process.env.NODE_ENV === 'production'
      ? process.env.MONGO_URI_PROD || process.env.MONGO_URI
      : process.env.MONGO_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  redisUrl: process.env.REDIS_URL,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.S3_BUCKET,
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
  },
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean),
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  swaggerEnabled: process.env.SWAGGER_ENABLED !== 'false',
};

module.exports = env;
