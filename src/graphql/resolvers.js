const ProductService = require('../services/productService');
const UserService = require('../services/userService');

module.exports = {
  Query: {
    products: (parent, args) => ProductService.getAll(args),
    product: (parent, { id }) => ProductService.getById(id),
    me: (parent, args, context) => (context.user ? UserService.getById(context.user.id) : null),
  },
  Mutation: {
    register: (parent, { input }) => UserService.register(input),
    login: (parent, { input }) => UserService.login(input),
    createProduct: (parent, { input }, context) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new Error('Forbidden');
      }
      return ProductService.create(input);
    },
  },
};
