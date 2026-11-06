'use strict';

const { Router } = require('express');
const env = require('../config/env');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const programRoutes = require('./program.routes');
const vocabularyRoutes = require('./vocabulary.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/programs', programRoutes);
router.use('/vocabulary', vocabularyRoutes);

// Root API status endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'English Learning API is active',
    environment: env.NODE_ENV,
    database: env.DB_NAME,
  });
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;

