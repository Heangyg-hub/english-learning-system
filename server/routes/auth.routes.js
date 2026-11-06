'use strict';

const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const {
  validate,
  registerValidation,
  loginValidation,
} = require('../validations/auth.validation');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;

