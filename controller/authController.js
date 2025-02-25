const User = require("../models/User");
const Vendor = require("../models/Vendor");
const asyncHandler = require("express-async-handler");
const { hashPassword, checkPassword } = require("../utils/hassPassword");
const sendEmail = require("../utils/mailer");
const jwt = require("jsonwebtoken");

const Signup = asyncHandler(async (req, res) => {
  try {
    const {
      email,
      password,
      confirmPassword,
      occupation,
      experience,
      phone,
      city,
    } = req.body;

    if (!email || !password || !confirmPassword || !phone || !city) {
      return res.status(400).json({ message: "Please input missing field(s)" });
    }

    // Check if email already exists in either collection
    const existingUser = await User.findOne({ email });
    const existingVendor = await Vendor.findOne({ email });

    if (existingUser || existingVendor) {
      return res.status(409).json({ message: "Email is already registered" }); // 409 Conflict
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await hashPassword(password);
    let newUser, userType;

    // Determine user type
    if (occupation && experience) {
      newUser = new Vendor({
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
      newUser = new User({ email, password: hashedPassword, role: "user" });
      userType = "user";
    }

    await newUser.save();

    // Send verification email
    await sendEmail(email, "VERIFY", newUser._id, userType);

    res.status(201).json({ message: `${userType} registered successfully` });
  } catch (error) {
    console.error("Signup Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

const Login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let user = await User.findOne({ email });
    let userType = "customer";

    if (!user) {
      user = await Vendor.findOne({ email });
      if (user) userType = "vendor";
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" }); // 401 Unauthorized
    }

    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
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
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = { Signup, Login };