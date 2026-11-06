'use strict';

const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(new ApiResponse(201, 'Registration successful', result));
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(new ApiResponse(200, 'Login successful', result));
    } catch (err) {
      next(err);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user._id);
      res.status(200).json(new ApiResponse(200, 'User profile fetched', user));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();

