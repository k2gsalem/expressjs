const jwt = require('jsonwebtoken');
const BaseService = require('./baseService');
const User = require('../models/user');
const env = require('../config');
const { generateRandomToken } = require('../utils/token');

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  async register(payload) {
    const existing = await User.findOne({ email: payload.email });
    if (existing) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }
    const user = await this.create(payload);
    return this.generateTokens(user);
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    return this.generateTokens(user);
  }

  async generateTokens(user) {
    const accessToken = jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
    });
    const refreshToken = jwt.sign({ id: user.id }, env.jwt.refreshSecret, {
      expiresIn: env.jwt.refreshExpiresIn,
    });
    user.tokens.push(refreshToken);
    await user.save();
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, env.jwt.refreshSecret);
      const user = await User.findById(decoded.id);
      if (!user || !user.tokens.includes(token)) {
        throw new Error();
      }
      const accessToken = jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, {
        expiresIn: env.jwt.expiresIn,
      });
      return { accessToken };
    } catch (error) {
      const err = new Error('Invalid refresh token');
      err.statusCode = 401;
      throw err;
    }
  }

  async revokeToken(userId, token) {
    const user = await User.findById(userId);
    if (!user) return null;
    user.tokens = user.tokens.filter((storedToken) => storedToken !== token);
    return user.save();
  }

  async seedAdmin() {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) return existingAdmin;
    const password = generateRandomToken(8).slice(0, 12);
    const admin = await this.create({
      name: 'Admin',
      email: `admin-${Date.now()}@example.com`,
      password,
      role: 'admin',
    });
    return { admin, password };
  }
}

module.exports = new UserService();
