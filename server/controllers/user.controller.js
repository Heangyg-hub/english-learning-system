'use strict';

const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

class UserController {
  // GET /api/users
  async getAll(req, res, next) {
    try {
      const { search, role, status } = req.query;
      const query = {};

      if (role && role !== 'all') {
        query.role = role;
      }

      if (status !== undefined && status !== '') {
        query.isActive = status === 'true' || status === true;
      }

      if (search && search.trim()) {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [{ username: regex }, { email: regex }];
      }

      const users = await User.find(query)
        .select('-password')
        .sort({ createdAt: -1 });

      res.status(200).json(new ApiResponse(200, 'Users retrieved successfully', users));
    } catch (err) {
      next(err);
    }
  }

  // POST /api/users (Admin creates student/user)
  async create(req, res, next) {
    try {
      const { username, email, password, role = 'user', isActive = true } = req.body;

      if (!username || !email || !password) {
        throw new ApiError(400, 'Username, email, and password are required.');
      }

      if (password.length < 6) {
        throw new ApiError(400, 'Password must be at least 6 characters long.');
      }

      const normalizedEmail = email.trim().toLowerCase();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        throw new ApiError(409, 'An account with this email address already exists.');
      }

      const newUser = await User.create({
        username: username.trim(),
        email: normalizedEmail,
        password,
        role: role === 'admin' ? 'admin' : 'user',
        isActive: isActive !== false,
      });

      const userObj = newUser.toObject();
      delete userObj.password;

      res.status(201).json(new ApiResponse(201, 'Student account created successfully', userObj));
    } catch (err) {
      next(err);
    }
  }

  // PUT /api/users/:id
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, role, isActive, password } = req.body;

      const user = await User.findById(id);
      if (!user) {
        throw new ApiError(404, 'User not found.');
      }

      if (email && email.trim().toLowerCase() !== user.email) {
        const normalizedEmail = email.trim().toLowerCase();
        const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: id } });
        if (existing) {
          throw new ApiError(409, 'Email address is already in use by another account.');
        }
        user.email = normalizedEmail;
      }

      if (username) user.username = username.trim();
      if (role) user.role = role === 'admin' ? 'admin' : 'user';
      if (isActive !== undefined) user.isActive = Boolean(isActive);

      if (password && password.trim()) {
        if (password.trim().length < 6) {
          throw new ApiError(400, 'New password must be at least 6 characters.');
        }
        user.password = password.trim();
      }

      await user.save();

      const updatedObj = user.toObject();
      delete updatedObj.password;

      res.status(200).json(new ApiResponse(200, 'Account updated successfully', updatedObj));
    } catch (err) {
      next(err);
    }
  }

  // DELETE /api/users/:id
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      if (req.user && req.user._id.toString() === id) {
        throw new ApiError(400, 'Administrators cannot delete their own active account.');
      }

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        throw new ApiError(404, 'User not found.');
      }

      res.status(200).json(new ApiResponse(200, 'User account deleted successfully', { id }));
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();

