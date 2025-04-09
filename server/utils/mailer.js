const nodemailer = require("nodemailer");
const Vendor = require("../models/Vendor");
const User = require("../models/User");
const generateToken = require("./generateToken");

// Setup email transport
const transport = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST || "sandbox.smtp.mailtrap.io",
  port: Number(process.env.NODEMAILER_PORT) || 2525,
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

// Function to find user in both collections
const findUserByEmail = async (email) => {
  let user = await User.findOne({ email });
  if (user) return { user, Model: User };

  user = await Vendor.findOne({ email });
  if (user) return { user, Model: Vendor };

  return null;
};

// Send verification or password reset email
const sendEmail = async (email, emailType) => {
  try {
    console.log(`Sending ${emailType} email to ${email}`);

    const userData = await findUserByEmail(email);
    if (!userData) {
      throw new Error("User not found");
    }

    const { user, Model } = userData;
    const token = generateToken();

    // Update fields based on email type
    const updateFields =
      emailType === "VERIFY"
        ? { verifyToken: token, verifyTokenExpiry: Date.now() + 3600000 }
        : {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          };

    await Model.findByIdAndUpdate(user._id, updateFields, { new: true });

    const subject =
      emailType === "VERIFY" ? "Verify your email" : "Reset your password";

    const html =
      emailType === "VERIFY"
        ? `<p>Please use this token to complete your verification: <b>${token}</b></p>`
        : `<p>Please use this token to reset your password: <b>${token}</b></p>`;

    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject,
      html: html,
    };

    await transport.sendMail(mailOptions);

    return { message: "Email sent and token stored successfully" };
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    throw new Error(error.message);
  }
};

// Resend email function
const resendEmail = async (email, emailType) => {
  try {
    console.log(`Resending ${emailType} email to ${email}`);

    const userData = await findUserByEmail(email);
    if (!userData) {
      throw new Error("User not found");
    }

    const { user, Model } = userData;
    const token = generateToken();

    const updateFields =
      emailType === "VERIFY"
        ? { verifyToken: token, verifyTokenExpiry: Date.now() + 3600000 }
        : {
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: Date.now() + 3600000,
          };

    await Model.findByIdAndUpdate(user._id, updateFields, { new: true });

    const subject =
      emailType === "VERIFY" ? "Verify your email" : "Reset your password";

    const html =
      emailType === "VERIFY"
        ? `<p>Please use this token to complete your verification: <b>${token}</b></p>`
        : `<p>Please use this token to reset your password: <b>${token}</b></p>`;

    const mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject,
      html: html,
    };

    await transport.sendMail(mailOptions);

    return { message: "Resend email successful" };
  } catch (error) {
    console.error("Error in resendEmail function:", error);
    throw new Error(error.message);
  }
};

// Verify email function
const verifyEmail = async (token) => {
  try {
    console.log(`Verifying email with token: ${token}`);

    let user = await User.findOne({ verifyToken: token });
    let Model = User;

    if (!user) {
      user = await Vendor.findOne({ verifyToken: token });
      Model = Vendor;
    }

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    // Check if token has expired
    if (user.verifyTokenExpiry < Date.now()) {
      throw new Error(
        "Token has expired. Please request a new verification email."
      );
    }

    // Update user verification status
    user.isVerified = true;
    user.verifyToken = null;
    user.verifyTokenExpiry = null;
    await user.save();

    return { message: "Email verified successfully" };
  } catch (error) {
    console.error("Error in verifyEmail function:", error);
    throw new Error(error.message);
  }
};

module.exports = { sendEmail, resendEmail, verifyEmail };
