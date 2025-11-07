const express = require('express');
const { body, param, query } = require('express-validator');
const productController = require('../controllers/productController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get(
  '/',
  [query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1 })],
  validate,
  asyncHandler(productController.getAll.bind(productController)),
);

router.get(
  '/:id',
  [param('id').isMongoId()],
  validate,
  asyncHandler(productController.getById.bind(productController)),
);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.array('images', 5),
  [body('name').notEmpty(), body('price').isFloat({ gt: 0 })],
  validate,
  productController.create,
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.array('images', 5),
  [param('id').isMongoId()],
  validate,
  productController.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  [param('id').isMongoId()],
  validate,
  productController.remove,
);

module.exports = router;
