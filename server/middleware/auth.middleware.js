'use strict';

const ApiError = require('../utils/ApiError');
const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User.model');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, 'Access denied. No authentication token provided.'));
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new ApiError(401, 'User no longer exists.'));
    }

    if (!user.isActive) {
      return next(new ApiError(403, 'Your account has been deactivated.'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);
    if (user?.isActive) {
      req.user = user;
    }
  } catch {
    // Continue anonymously
  }

  next();
};

module.exports = { protect, optionalProtect };

