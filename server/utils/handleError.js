const createError = require("./createError");

/**
 * Wrapper to create and pass error to the next middleware
 * @param {Object} res - Express response object
 * @param {Object} next - Express next function
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 */
const handleErrorResponse = (res, next, statusCode, message) => {
  return next(createError(message, statusCode));
};

module.exports = { handleErrorResponse };


