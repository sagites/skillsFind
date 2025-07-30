const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: String, default: "vendor" },
  profile: {
    phone: { type: String },
    address: [String],
    profilePicture: { type: String }, // Store URL or file reference
    bio: { type: String },
    occupation: { type: String },
    experience: { type: Number },
    city: { type: String },
  },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  forgotPasswordToken: { type: String },
  forgotPasswordTokenExpiry: { type: Date },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },
});

module.exports = mongoose.model("Vendor", VendorSchema);
