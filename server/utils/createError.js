/**
 * Create an error object for centralized error handling
 * @param {string} message
 * @param {number} statusCode
 */
const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = createError;
