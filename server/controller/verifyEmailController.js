const asyncHandler = require('express-async-handler');
const { verifyEmail, sendEmail } = require('../utils/mailer'); // Adjust the path as necessary
const Vendor = require("../models/Vendor");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const verifyEmailMail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  console.log("Received token:", token); // Log the token

  try {
    const data = await verifyEmail(token);
    console.log("Verification response:", data); // Log response
    res.status(201).json({ message: data });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: error.message }); // Return actual error message
  }
});

const resendEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log(`Resend email request for: ${email}`);

    // Check if user exists in User or Vendor collection
    let user = await User.findOne({ email });
    let Model = User;
    let userType = "user";

    if (!user) {
      user = await Vendor.findOne({ email });
      if (user) {
        Model = Vendor;
        userType = "vendor";
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate a new token
    const newToken = generateToken();
    user.verifyToken = newToken;
    user.verifyTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    await user.save();

    // Resend verification email
    await sendEmail(email, "VERIFY", user._id, userType);

    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error("Error in resendEmail:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  verifyEmailMail,
  resendEmail,
};