const request = require('supertest');
const app = require('../../src/app');

jest.mock('../../src/services/userService', () => ({
  register: jest.fn().mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh', user: {} }),
  login: jest.fn().mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh', user: {} })
}));

const UserService = require('../../src/services/userService');

describe('Auth routes', () => {
  it('registers a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test',
      email: 'test@example.com',
      password: 'password'
    });
    expect(res.statusCode).toBe(201);
    expect(UserService.register).toHaveBeenCalled();
  });

  it('validates login payload', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'not-an-email'
    });
    expect(res.statusCode).toBe(422);
  });
});
