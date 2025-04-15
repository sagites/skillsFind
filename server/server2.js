const cluster = require('cluster');
const os = require('os');
require('dotenv').config();

const connectDB = require('./config/db_config');
const { handleErrorResponse } = require('./utils/errorHandler'); // Import custom error handler

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 2500;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
    cluster.fork();
  });

} else {
  const express = require('express');
  const helmet = require('helmet');
  const compression = require('compression');

  const auth = require('./routes/authRoutes');
  const email = require('./routes/verifyEmail.js');
  const Bookmark = require('./routes/bookmarksRoute.js');
  const forgotPassword = require('./routes/forgotPasswordRoutes.js');
  const listAllServiceProviders = require('./routes/listAllServiceProvidersRoutes.js');

  const app = express();

  // Middleware
  app.use(helmet()); // Security headers
  app.use(compression()); // Gzip compression
  app.use(express.json());

  // Routes
  app.use('/api/auth', auth);
  app.use('/api/email', email);
  app.use('/api/bookmark', Bookmark);
  app.use('/api/forgot-password', forgotPassword);
  app.use('/api/serviceProvidersList', listAllServiceProviders);

  // 404 Handler
  app.use((req, res) => {
    handleErrorResponse(res, 404, 'Route not found');
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error(err.stack);
    handleErrorResponse(res, 500, 'Internal Server Error');
  });

  // Start server after DB connects
  const start = async () => {
    try {
      await connectDB(process.env.MONGODB_URL);
      app.listen(PORT, () =>
        console.log(`Worker ${process.pid} running at http://localhost:${PORT}`)
      );
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1);
    }
  };

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(`Worker ${process.pid} shutting down...`);
    process.exit();
  });

  start();
}
