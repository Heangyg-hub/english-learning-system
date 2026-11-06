'use strict';

const { Router } = require('express');
const vocabularyController = require('../controllers/vocabulary.controller');
const {
  validate,
  mongoIdParam,
  getVocabularyQueryValidation,
  createVocabularyValidation,
} = require('../validations/vocabulary.validation');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = Router();

// Stats (place before :id to prevent collision)
router.get('/stats', vocabularyController.getVocabularyStats);

// Public / Learner endpoints
router.get('/', getVocabularyQueryValidation, validate, vocabularyController.getAllVocabulary);
router.get('/:id', mongoIdParam, validate, vocabularyController.getVocabularyById);

// Admin-only CRUD
router.post(
  '/',
  protect,
  authorize('admin'),
  createVocabularyValidation,
  validate,
  vocabularyController.createVocabulary
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  mongoIdParam,
  validate,
  vocabularyController.updateVocabulary
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  mongoIdParam,
  validate,
  vocabularyController.deleteVocabulary
);

module.exports = router;

