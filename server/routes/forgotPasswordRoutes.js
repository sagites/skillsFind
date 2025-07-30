const router = require("express").Router();

const {
  forgotPassword,
  changePassword,
} = require("../controller/passwordController");

// @route   POST /api/forgot-password
// @desc    Send forgot password email
router.post("/", forgotPassword);

// @route   POST /api/forgot-password/change
// @desc    Change password using token
router.post("/change", changePassword);

module.exports = router;
