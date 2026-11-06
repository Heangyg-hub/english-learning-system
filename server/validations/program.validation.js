'use strict';

const { body, query, param } = require('express-validator');
const { validate, mongoIdParam } = require('./common.validation');

const createProgramValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Program name is required')
    .isLength({ max: 100 }).withMessage('Program name cannot exceed 100 characters'),

  body('slug')
    .trim()
    .notEmpty().withMessage('Program slug is required')
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must consist of lowercase letters, numbers, and hyphens'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('icon')
    .optional()
    .trim()
    .isString().withMessage('Icon must be a string identifier'),

  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

const updateProgramValidation = [
  ...mongoIdParam,
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Program name cannot exceed 100 characters'),

  body('slug')
    .optional()
    .trim()
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must consist of lowercase letters, numbers, and hyphens'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),

  body('icon')
    .optional()
    .trim()
    .isString().withMessage('Icon must be a string identifier'),

  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

const createLevelValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Level name is required'),

  body('code')
    .trim()
    .notEmpty().withMessage('Level code is required (e.g. A1, A2, B1)'),

  body('description')
    .optional()
    .trim(),

  body('order')
    .optional()
    .isInt({ min: 0 }).withMessage('Order must be a non-negative integer'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

module.exports = {
  validate,
  mongoIdParam,
  createProgramValidation,
  updateProgramValidation,
  createLevelValidation,
};

