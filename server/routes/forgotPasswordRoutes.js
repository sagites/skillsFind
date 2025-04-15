const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  changePassword,
} = require("../controller/passwordController");
const protect = require("../middleware/protect");

// @route   POST /api/forgot-password
// @desc    Send forgot password email
router.post("/", forgotPassword);

// @route   POST /api/forgot-password/change
// @desc    Change password using token
router.post("/change", changePassword);

module.exports = router;
