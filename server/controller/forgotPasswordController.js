const asyncHandler = require('express-async-handler');
const {hashPassword} = require('../utils/hassPassword');
const { sendEmail } = require('../utils/mailer');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const result = await sendEmail(email, "RESET_PASSWORD");
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  let user = await User.findOne({ forgotPasswordToken: token });
  let Model = User;

  if (!user) {
    user = await Vendor.findOne({ forgotPasswordToken: token });
    Model = Vendor;
  }

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  if (user.forgotPasswordTokenExpiry < Date.now()) {
    return res.status(400).json({ message: "Token has expired. Please request a new one." });
  }

  const hashedPassword = await hashPassword(newPassword);

  user.password = hashedPassword;
  user.forgotPasswordToken = null;
  user.forgotPasswordTokenExpiry = null;

  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});

module.exports = {
  forgotPassword,
  resetPassword,
};
