const BaseController = require('./baseController');
const asyncHandler = require('../middlewares/asyncHandler');
const UserService = require('../services/userService');
const { successResponse } = require('../utils/response');

class UserController extends BaseController {
  constructor() {
    super(UserService);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
  }

  create(req, res, next) {
    return asyncHandler(async () => {
      const user = await UserService.create(req.body);
      return successResponse(res, 'User created', user, 201);
    })(req, res, next);
  }

  update(req, res, next) {
    return asyncHandler(async () => {
      const user = await UserService.update(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return successResponse(res, 'User updated', user);
    })(req, res, next);
  }

  remove(req, res, next) {
    return asyncHandler(async () => {
      await UserService.delete(req.params.id);
      return successResponse(res, 'User deleted');
    })(req, res, next);
  }
}

module.exports = new UserController();
