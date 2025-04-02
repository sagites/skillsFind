const handleErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).json({ success: false, message });
};

module.exports = { handleErrorResponse };
