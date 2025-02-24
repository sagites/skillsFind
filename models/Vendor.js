const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed password
  profile: {
    phone: { type: String },
    address: [String ],
    profilePicture: { type: String }, // Store URL or file reference
    bio: { type: String },
    occupation: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

module.exports = mongoose.model("Vendor", VendorSchema);