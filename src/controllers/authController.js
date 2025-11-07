const asyncHandler = require('../middlewares/asyncHandler');
const UserService = require('../services/userService');
const { successResponse } = require('../utils/response');

exports.register = asyncHandler(async (req, res) => {
  const result = await UserService.register(req.body);
  return successResponse(res, 'User registered successfully', result, 201);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await UserService.login(req.body);
  return successResponse(res, 'Login successful', result);
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const result = await UserService.refreshToken(req.body.refreshToken);
  return successResponse(res, 'Token refreshed', result);
});

exports.logout = asyncHandler(async (req, res) => {
  await UserService.revokeToken(req.user.id, req.body.refreshToken);
  return successResponse(res, 'Logged out successfully');
});
