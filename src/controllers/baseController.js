const { successResponse } = require('../utils/response');

class BaseController {
  constructor(service) {
    this.service = service;
  }

  async getAll(req, res) {
    const data = await this.service.getAll(req.query);
    return successResponse(res, 'Resources fetched successfully', data);
  }

  async getById(req, res) {
    const data = await this.service.getById(req.params.id);
    if (!data) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    return successResponse(res, 'Resource fetched successfully', data);
  }
}

module.exports = BaseController;
