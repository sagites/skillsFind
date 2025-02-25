const User = require("../models/User");
const Vendor = require("../models/Vendor");
const asyncHandler = require("express-async-handler");
const { hashPassword, checkPassword } = require("../utils/hassPassword");
const sendEmail = require("../utils/mailer");
const jwt = require("jsonwebtoken");

const Signup = asyncHandler(async (req, res) => {
  const {
    email,
    password,
    confirmPassword,
    occupation,
    experience,
    phone,
    city,
  } = req.body;

  if (
    !email ||
    !password ||
    !confirmPassword ||
    !phone ||
    !city
  ) {
    return res.status(400).json({ message: "Please input missing field(s)" });
  }

  // Check if email is already registered in either collection
  const existingUser = await User.findOne({ email });
  const existingVendor = await Vendor.findOne({ email });

  if (existingUser || existingVendor) {
    return res.status(400).json({ message: "Email is already registered" });
  }

  // Check password length
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

  // Determine if the user is a vendor or customer automatically
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
  await sendEmail(email, "VERIFY", newUser._id, userType);
  res.status(201).json({ message: `${userType} registered successfully` });
});

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in either collection
  let user = await User.findOne({ email });
  let userType = "customer";

  if (!user) {
    user = await Vendor.findOne({ email });
    if (user) userType = "vendor";
  }

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Compare the provided password with the hashed password
  const isPasswordValid = await checkPassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate a JWT token
  const token = jwt.sign(
    { userId: user._id, userType },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ message: "Login successful", token, userType });
});

module.exports = {
  Signup,
  Login,
};
