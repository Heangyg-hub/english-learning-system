'use strict';

const http = require('http');
const app = require('./server');
const { connectDB, disconnectDB } = require('./config/db');
const env = require('./config/env');

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDB();

    server.listen(env.PORT, () => {
      console.log(`[English Learning Server] Running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('[English Learning Server] Failed to start:', error);
    process.exit(1);
  }
};

const handleShutdown = async (signal) => {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    await disconnectDB();
    console.log('[Server] Process terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

startServer();

