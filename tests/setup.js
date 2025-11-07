process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'testsecret';
process.env.MONGO_URI = 'mongodb://localhost:27017/test';
process.env.REDIS_URL = '';
process.env.AWS_ACCESS_KEY_ID = 'key';
process.env.AWS_SECRET_ACCESS_KEY = 'secret';
process.env.AWS_REGION = 'us-east-1';
process.env.S3_BUCKET = 'bucket';
process.env.SWAGGER_ENABLED = 'false';

jest.mock('../src/config/database', () => jest.fn(() => Promise.resolve()));
