const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');

jest.mock('../../src/services/productService', () => ({
  getAll: jest.fn().mockResolvedValue({ items: [], pagination: { total: 0, page: 1, limit: 10, pages: 0 } }),
  getById: jest.fn().mockResolvedValue({ id: '123' }),
  create: jest.fn().mockResolvedValue({ id: '123', name: 'New Product' })
}));

jest.mock('../../src/services/userService', () => ({
  getById: jest.fn().mockResolvedValue({ id: '1', role: 'admin', email: 'admin@example.com' })
}));

jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '1', role: 'admin' }));

const ProductService = require('../../src/services/productService');

describe('Product routes', () => {
  it('returns products list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(ProductService.getAll).toHaveBeenCalled();
  });

  it('rejects creation without token', async () => {
    const res = await request(app).post('/api/products').send({ name: 'Test', price: 10 });
    expect(res.statusCode).toBe(401);
  });

  it('creates product with admin role', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', 'Bearer token')
      .field('name', 'Test Product')
      .field('price', 19.99);
    expect(res.statusCode).toBe(201);
  });
});
