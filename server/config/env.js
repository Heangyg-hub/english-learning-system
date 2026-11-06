'use strict';

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/english_learning_db',
  JWT_SECRET: process.env.JWT_SECRET || 'english_learning_jwt_secret_key_2026_very_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_ADMIN_URL: process.env.CLIENT_ADMIN_URL || 'http://localhost:5174',
  CLIENT_USER_URL: process.env.CLIENT_USER_URL || 'http://localhost:5173',
};
