const os = require('os');
require('dotenv').config();
const cluster = require('cluster');
const express = require('express');
const connectDB = require('./config/db_config');
const auth = require('./routes/authRoutes')
const email = require('./routes/verifyEmail.js');
const Bookmark = require("./routes/bookmarksRoute.js");

const app = express();
app.use(express.json());

//Routes
app.use('/api/auth', auth)
app.use('/api/email', email)
app.use('/api/bookmark', Bookmark)

const PORT = process.env.PORT || 2500;

const start = async () => {
  if (cluster.isMaster) {
      const numCPUs = os.cpus().length;
      for (let i = 0; i < numCPUs; i++) {
          cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
          console.log(`Worker ${worker.process.pid} died`);
      });

  } else {
      try {
          await connectDB(process.env.MONGODB_URL);
          app.listen(PORT, () => console.log(`Worker ${process.pid} running on http://localhost:${PORT}`));
      } catch (error) {
          console.log(error);
      }
  }
};

start();