const BaseController = require('./baseController');
const asyncHandler = require('../middlewares/asyncHandler');
const ProductService = require('../services/productService');
const { successResponse } = require('../utils/response');
const { getIO } = require('../utils/socket');

class ProductController extends BaseController {
  constructor() {
    super(ProductService);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  create(req, res, next) {
    return asyncHandler(async () => {
      const payload = { ...req.body };
      if (req.files && req.files.length) {
        payload.images = req.files.map((file) => file.location || file.path);
      }
      const product = await ProductService.create(payload);
      try {
        getIO().emit('product:created', product);
      } catch (error) {
        // socket may not be initialized in tests
      }
      return successResponse(res, 'Product created', product, 201);
    })(req, res, next);
  }

  update(req, res, next) {
    return asyncHandler(async () => {
      const payload = { ...req.body };
      if (req.files && req.files.length) {
        payload.images = req.files.map((file) => file.location || file.path);
      }
      const product = await ProductService.update(req.params.id, payload);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      try {
        getIO().emit('product:updated', product);
      } catch (error) {
        // ignore if socket not available
      }
      return successResponse(res, 'Product updated', product);
    })(req, res, next);
  }

  remove(req, res, next) {
    return asyncHandler(async () => {
      await ProductService.delete(req.params.id);
      try {
        getIO().emit('product:deleted', { id: req.params.id });
      } catch (error) {
        // ignore
      }
      return successResponse(res, 'Product deleted');
    })(req, res, next);
  }
}

module.exports = new ProductController();
