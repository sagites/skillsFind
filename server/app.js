const express = require("express");
const { requestLogger, errorLogger } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const routes = require("./routes");

const app = express();

// Built-in middlewares
app.use(express.json());

// Custom middlewares
app.use(requestLogger);

// Routes
app.use("/api", routes);

// Error handling
app.use(errorLogger);
app.use(errorHandler);

module.exports = app;
