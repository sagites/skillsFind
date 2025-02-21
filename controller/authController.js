const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const { hashPassword, checkPassword } = require("../utils/hassPassword");
const jwt = require('jsonwebtoken')

const Signup = asyncHandler(async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    res.status(400).json("please input missing field(s)");
  }

  // Check if the email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email is already registered" });
  }

  // Check if password meets minimum length requirement
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password should be at least 6 characters long" });
  }

  if (confirmPassword !== password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  
  const hashedPassword = await hashPassword(password);
  const user = new User({ email, password: hashedPassword});
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

const Login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await checkPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})


module.exports = {
    Signup,
    Login,
}
