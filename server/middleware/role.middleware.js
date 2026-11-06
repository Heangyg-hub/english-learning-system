'use strict';

const ApiError = require('../utils/ApiError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, 'Not authenticated.'));
    }

    const userRole = typeof req.user.role === 'object' ? req.user.role.name : req.user.role;

    if (!roles.includes(userRole)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${userRole}`
        )
      );
    }

    next();
  };
};

module.exports = { authorize };

