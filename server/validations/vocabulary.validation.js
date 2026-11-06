'use strict';

const { body, query } = require('express-validator');
const { validate, mongoIdParam } = require('./common.validation');

const getVocabularyQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim(),
  query('difficulty').optional().isIn(['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced']),
  query('topic').optional().trim(),
  query('tag').optional().trim(),
  query('partOfSpeech').optional().trim(),
  query('isVerified').optional().isBoolean(),
];

const createVocabularyValidation = [
  body('word')
    .trim()
    .notEmpty().withMessage('Word is required'),

  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard', 'beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),

  body('meanings')
    .optional()
    .isArray().withMessage('Meanings must be an array'),

  body('meanings.*.partOfSpeech')
    .optional()
    .isIn(['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection', 'phrase', 'idiom'])
    .withMessage('Invalid part of speech'),

  body('meanings.*.khmerMeaning')
    .optional()
    .trim(),

  body('tags').optional().isArray(),
  body('topics').optional().isArray(),
  body('isVerified').optional().isBoolean(),
];

module.exports = {
  validate,
  mongoIdParam,
  getVocabularyQueryValidation,
  createVocabularyValidation,
};

