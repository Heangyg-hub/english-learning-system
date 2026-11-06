'use strict';

const ApiError = require('../utils/ApiError');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    // Mongoose CastError (bad ObjectId)
    if (error.name === 'CastError') {
      error = new ApiError(400, `Invalid ${error.path}: ${error.value}`);
    }
    // Mongoose Duplicate Key Error
    else if (error.code === 11000) {
      const keys = Object.keys(error.keyValue || {}).join(', ');
      error = new ApiError(409, `Duplicate value for field(s): ${keys}. Must be unique.`);
    }
    // Mongoose ValidationError
    else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors || {}).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      error = new ApiError(422, 'Validation failed', errors);
    }
    // JWT errors
    else if (error.name === 'JsonWebTokenError') {
      error = new ApiError(401, 'Invalid authentication token.');
    } else if (error.name === 'TokenExpiredError') {
      error = new ApiError(401, 'Authentication token has expired.');
    } else {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';
      error = new ApiError(statusCode, message);
    }
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors?.length ? { errors: error.errors } : {}),
    ...(env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;

