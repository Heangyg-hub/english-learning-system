'use strict';

/**
 * ApiError — custom error class for all application errors.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode  HTTP status code
   * @param {string} message     Error description
   * @param {Array}  errors      Optional field validation errors
   * @param {string} stack       Optional stack trace
   */
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;

