const os = require("os");
const app = require("./app");
const cluster = require("cluster");
const connectDB = require("./config/db_config");

const PORT = process.env.PORT || 2500;
const MONGO_URL = process.env.MONGODB_URL;

const startServer = async () => {
  try {
    await connectDB(MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Worker ${process.pid} running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(`Primary ${process.pid} is running, forking ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  startServer();
}
