'use strict';

const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const { generateAccessToken } = require('../utils/jwt');

class AuthService {
  async register({ username, email, password, role = 'user' }) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new ApiError(409, 'Email is already registered.');
    }

    const user = await User.create({
      username,
      email: normalizedEmail,
      password,
      role: role === 'admin' ? 'user' : role, // Only seed or admin can grant admin role
    });

    const token = generateAccessToken({ userId: user._id, role: user.role });

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  async login({ email, password }) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated. Please contact support.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = generateAccessToken({ userId: user._id, role: user.role });

    return {
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    };
  }

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    return user;
  }

  async updateProfile(userId, { username, avatar }) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found.');
    }
    if (username !== undefined && username.trim()) {
      user.username = username.trim();
    }
    if (avatar !== undefined) {
      user.avatar = avatar;
    }
    await user.save();
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };
  }
}

module.exports = new AuthService();

