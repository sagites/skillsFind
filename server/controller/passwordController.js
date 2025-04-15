const { sendSignUpEmail } = require("../utils/mailer");
const Vendor = require("../models/Vendor");
const User = require("../models/User");
const {hashPassword} = require("../utils/hassPassword");
const { handleErrorResponse } = require("../utils/handleError")

// Forgot Password Controller
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return handleErrorResponse(res, 400, "Email is required");
  }

  try {
    const result = await sendSignUpEmail(email, "FORGOT");
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
};

// Change Password Controller
const changePassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return handleErrorResponse(res, 400, "Token and new password are required");
  }

  try {
    let user = await User.findOne({ forgotPasswordToken: token });
    let Model = User;

    if (!user) {
      user = await Vendor.findOne({ forgotPasswordToken: token });
      Model = Vendor;
    }

    if (!user || user.forgotPasswordTokenExpiry < Date.now()) {
      return handleErrorResponse(res, 400, "Invalid or expired token");
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    user.forgotPasswordToken = null;
    user.forgotPasswordTokenExpiry = null;

    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
};

module.exports = {
  forgotPassword,
  changePassword,
};
