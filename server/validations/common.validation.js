'use strict';

const { validationResult, param } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return next(new ApiError(422, 'Validation failed', errorList));
  }
  next();
};

const mongoIdParam = [
  param('id')
    .isMongoId()
    .withMessage('Invalid MongoDB ObjectId in route parameters'),
];

module.exports = {
  validate,
  mongoIdParam,
};

