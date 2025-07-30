const os = require("os");
require("dotenv").config();
const cluster = require("cluster");
const express = require("express");
const auth = require("./routes/authRoutes");
const connectDB = require("./config/db_config");
const email = require("./routes/verifyEmail.js");
const reviews = require("./routes/reviewRoutes.js");
const Bookmark = require("./routes/bookmarksRoute.js");
const updateProfile = require("./routes/updateProfileRoutes.js");
const forgotPassword = require("./routes/forgotPasswordRoutes.js");
const { requestLogger, errorLogger } = require("./middleware/logger");
const listAllServiceProviders = require("./routes/listAllServiceProvidersRoutes.js");

const app = express();
app.use(express.json());
app.use(requestLogger);

//Routes
app.use("/api/auth", auth);
app.use("/api/email", email);
app.use("/api/reviews", reviews);
app.use("/api/bookmark", Bookmark);
app.use("/api/updateProfile", updateProfile);
app.use("/api/forgot-password", forgotPassword);
app.use("/api/serviceProvidersList", listAllServiceProviders);

app.use(errorLogger); // Logs errors after routes

const PORT = process.env.PORT || 2500;

const start = async () => {
  if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
    });
  } else {
    try {
      await connectDB(process.env.MONGODB_URL);
      app.listen(PORT, () =>
        console.log(`Worker ${process.pid} running on http://localhost:${PORT}`)
      );
    } catch (error) {
      console.log(error);
    }
  }
};

start();