'use strict';

const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  // Reuse existing connection if already active (e.g. serverless functions or hot-reloading)
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(env.MONGO_URI, {
      dbName: env.DB_NAME,
    });
    console.log(
      `[MongoDB] Connected successfully to host: ${conn.connection.host} | Database: "${conn.connection.name}" [Env: ${env.NODE_ENV}]`
    );
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully');
  } catch (error) {
    console.error(`[MongoDB] Disconnection error: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
