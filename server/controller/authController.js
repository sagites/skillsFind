const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const { sendSignUpEmail } = require("../utils/mailer");
const asyncHandler = require("express-async-handler");
const { handleErrorResponse } = require("../utils/handleError");
const { hashPassword, checkPassword } = require("../utils/hassPassword");

const Signup = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      occupation,
      experience,
      phone,
      city,
    } = req.body;

    if (!email || !name || !password || !confirmPassword || !phone || !city) {
      return handleErrorResponse(res, next, 400, "Please input all fields");
    }

    // Check if email already exists in either collection
    const existingUser = await User.findOne({ email });
    const existingVendor = await Vendor.findOne({ email });

    if (existingUser || existingVendor) {
      return res.status(409).json({ message: "Email is already registered" }); // 409 Conflict
    }

    if (password.length < 6) {
      return handleErrorResponse(
        res,
        next,
        400,
        "Passwords should be more than 6 characters"
      );
    }

    if (confirmPassword !== password) {
      return handleErrorResponse(res, next, 400, "Passwords do not match");
    }

    const hashedPassword = await hashPassword(password);
    let newUser, userType;

    // Determine user type
    if (occupation && experience) {
      newUser = new Vendor({
        name,
        email,
        password: hashedPassword,
        role: "vendor",
        profile: {
          occupation: occupation || "N/A",
          experience: experience || 0,
          phone: phone,
          city: city,
        },
      });
      userType = "vendor";
    } else {
      newUser = new User({
        email,
        name,
        password: hashedPassword,
        role: "user",
      });
      userType = "user";
    }

    await newUser.save();

    // Send verification email
    // await sendSignUpEmail(email, "VERIFY", newUser._id, userType);

    res.status(201).json({ message: `${userType} registered successfully` });
  } catch (error) {
    console.error("Signup Error:", error);
    handleErrorResponse(res, next, 500, error.message);
  }
});

const Login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleErrorResponse(
        res,
        next,
        400,
        "Email and password are required"
      );
    }

    let user = await User.findOne({ email });
    let userType = "customer";

    if (!user) {
      user = await Vendor.findOne({ email });
      if (user) userType = "vendor";
    }

    if (!user) {
      return handleErrorResponse(res, next, 404, "Admin not found");
    }

    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      return handleErrorResponse(res, next, 401, "Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id, userType },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token, userType });
  } catch (error) {
    console.error("Login Error:", error);
    handleErrorResponse(res, next, 500, error.message);
  }
});

module.exports = { Signup, Login };
