const nodemailer = require("nodemailer");
const Vendor = require("../models/Vendor");
const User = require("../models/User");
const generateToken = require("./generateToken");

const sendEmail = async (email, emailType, userId, userType) => {
  try {
    console.log(email, emailType, userId, userType, "okay");

    if (!["user", "vendor"].includes(userType)) {
      throw new Error("Invalid user type. Must be 'user' or 'vendor'.");
    }

    const Model = userType === "vendor" ? Vendor : User;

    // Generate token
    const token = generateToken(); // Ensure generateToken returns a valid token

    // Define update fields
    const updateFields =
      emailType === "VERIFY"
        ? { verifyToken: token, verifyTokenExpiry: Date.now() + 3600000 }
        : { forgotPasswordToken: token, forgotPasswordTokenExpiry: Date.now() + 3600000 };

    // Update the user/vendor document in the database
    const updatedUser = await Model.findByIdAndUpdate(userId, updateFields, { new: true });

    if (!updatedUser) {
      throw new Error("User not found or update failed");
    }

    // Setup email transport
    const transport = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST || "sandbox.smtp.mailtrap.io",
      port: Number(process.env.NODEMAILER_PORT) || 2525,
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const subject = emailType === "VERIFY" ? "Verify your email" : "Reset your password";

    const mailOptions = {
      from: "chizzyikemba@gmail.com",
      to: email,
      subject,
      html: `<p>Please use this token to complete your verification: <b>${token}</b></p>`,
    };

    // Send email
    await transport.sendMail(mailOptions);

    return { message: "Email sent and token stored successfully" };
  } catch (error) {
    console.error("Error in sendEmail function:", error);
    throw new Error(error.message);
  }
};

module.exports = sendEmail;