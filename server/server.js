'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const env = require('./config/env');
const { connectDB } = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes');

const app = express();

app.set('trust proxy', 1);
app.disable('x-powered-by');

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // In development or when no origin header (like mobile apps/postman), allow
      if (!origin || env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      const allowedOrigins = [env.CLIENT_ADMIN_URL, env.CLIENT_USER_URL].filter(Boolean);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow Vercel preview and production domains
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      try {
        const host = new URL(origin).hostname;
        if (host === 'localhost' || host === '127.0.0.1') {
          return callback(null, true);
        }
      } catch {
        // invalid URL
      }
      callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
  })
);

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Request parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Ensure database connection for serverless/Vercel environments
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'English Learning Server is running',
    api: '/api',
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;

