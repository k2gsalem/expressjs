const express = require('express');
const { body, param } = require('express-validator');
const userController = require('../controllers/userController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const asyncHandler = require('../middlewares/asyncHandler');

const router = express.Router();

router.use(authenticate);

router.get('/', authorize('admin'), asyncHandler(userController.getAll.bind(userController)));
router.get(
  '/:id',
  authorize('admin'),
  [param('id').isMongoId()],
  validate,
  asyncHandler(userController.getById.bind(userController)),
);
router.post(
  '/',
  authorize('admin'),
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'user']),
  ],
  validate,
  userController.create,
);
router.put('/:id', authorize('admin'), [param('id').isMongoId()], validate, userController.update);
router.delete(
  '/:id',
  authorize('admin'),
  [param('id').isMongoId()],
  validate,
  userController.remove,
);

module.exports = router;
