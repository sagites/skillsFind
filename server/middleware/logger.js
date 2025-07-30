const winston = require("winston");
const path = require("path");

// Create Winston logger with separate error log file
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/app.log"),
      level: "info",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logMessage = `${req.method} ${req.originalUrl} | Status: ${
      res.statusCode
    } | User: ${req.userId || "Guest"} | AccountType: ${
      req.accountType || "N/A"
    } | Duration: ${duration}ms`;
    logger.info(logMessage);
  });

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  const logMessage = `ERROR: ${req.method} ${req.originalUrl} | User: ${
    req.userId || "Guest"
  } | AccountType: ${req.accountType || "N/A"} | Message: ${err.message}`;
  logger.error(logMessage);
  next(err); // Pass to the default error handler
};

module.exports = { requestLogger, errorLogger, logger };