'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '7d',
  });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = {
  generateAccessToken,
  verifyAccessToken,
};

