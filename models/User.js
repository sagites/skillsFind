const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: String, enum: ["customer", "service_provider", "admin"] },
  profile: {
    phone: { type: String },
    address: { type: String },
    profilePicture: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

module.exports = mongoose.model("User", UserSchema);
