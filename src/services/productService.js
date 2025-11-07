const BaseService = require('./baseService');
const Product = require('../models/product');
const getRedisClient = require('../config/redis');

class ProductService extends BaseService {
  constructor() {
    super(Product);
    this.redis = getRedisClient;
  }

  async getAll(query = {}) {
    const client = this.redis();
    const { page = 1, limit = 10, search, category } = query;
    const cacheKey = `products:${page}:${limit}:${search || ''}:${category || ''}`;

    const cached = await client.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    const result = {
      items,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    };

    await client.set(cacheKey, JSON.stringify(result), 'EX', 60);
    return result;
  }
}

module.exports = new ProductService();
