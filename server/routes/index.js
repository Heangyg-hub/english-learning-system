'use strict';

const { Router } = require('express');
const authRoutes = require('./auth.routes');
const programRoutes = require('./program.routes');
const vocabularyRoutes = require('./vocabulary.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/programs', programRoutes);
router.use('/vocabulary', vocabularyRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;

