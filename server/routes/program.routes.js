'use strict';

const { Router } = require('express');
const programController = require('../controllers/program.controller');
const {
  validate,
  mongoIdParam,
  createProgramValidation,
  updateProgramValidation,
  createLevelValidation,
} = require('../validations/program.validation');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = Router();

// Public / Learner endpoints
router.get('/', programController.getAllPrograms);
router.get('/:id', mongoIdParam, validate, programController.getProgramById);
router.get('/:id/levels', mongoIdParam, validate, programController.getProgramLevels);

// Admin-only Program endpoints
router.post(
  '/',
  protect,
  authorize('admin'),
  createProgramValidation,
  validate,
  programController.createProgram
);
router.put(
  '/:id',
  protect,
  authorize('admin'),
  updateProgramValidation,
  validate,
  programController.updateProgram
);
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  mongoIdParam,
  validate,
  programController.deleteProgram
);

// Admin-only Program Level sub-resource endpoints
router.post(
  '/:id/levels',
  protect,
  authorize('admin'),
  mongoIdParam,
  createLevelValidation,
  validate,
  programController.createLevel
);
router.put(
  '/:id/levels/:levelId',
  protect,
  authorize('admin'),
  programController.updateLevel
);
router.delete(
  '/:id/levels/:levelId',
  protect,
  authorize('admin'),
  programController.deleteLevel
);

module.exports = router;

