import nodemailer from "nodemailer";
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const generateToken = require('./generateToken');
// Assuming you have a Vendor modelimport bcryptjs from "bcryptjs";

const sendEmail = async (email, emailType, userId, userType) => {
  try {
    console.log(email, emailType, userId, userType, "okay");

    // Validate userType
    if (!["user", "vendor"].includes(userType)) {
      throw new Error("Invalid user type. Must be 'user' or 'vendor'.");
    }

    // Determine the correct model based on userType
    const Model = userType === "vendor" ? Vendor : User;

    // Create a hashed token
    const token = await generateToken();
    // const salt = await bcryptjs.genSalt(10);
    // const hashedToken = await bcryptjs.hash(userId.toString(), salt);

    // Prepare the update fields based on email type
    const updateFields =
      emailType === "VERIFY"
        ? { verifyToken: token, verifyTokenExpiry: Date.now() + 3600000 }
        : { forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 3600000 };

    // Update the correct model
    await Model.findByIdAndUpdate(userId, updateFields);

    // Create Nodemailer transport
    const transport = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST || "sandbox.smtp.mailtrap.io",
      port: Number(process.env.NODEMAILER_PORT) || 2525,
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    // Define email content
    const subject = emailType === "VERIFY" ? "Verify your email" : "Reset your password";

    const mailOptions = {
      from: "chizzyikemba@gmail.com",
      to: email,
      subject,
      html: `<p>Please supply this token to complete your verfication ${token}</p>`
    };

    // Send email and return response
    return await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    throw new Error(error.message);
  }
};

module.exports = sendEmail;

