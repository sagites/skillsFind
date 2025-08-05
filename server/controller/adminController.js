const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/admin");
const Vendor = require("../models/Vendor");
const asyncHandler = require("express-async-handler");
const { handleErrorResponse } = require("../utils/handleError");
const { hashPassword, checkPassword } = require("../utils/hassPassword");

const adminSignup = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: "Please input all fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Create Admin Error:", error);
    handleErrorResponse(res, 500, error.message);
  }
});

const adminLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    let admin = await Admin.findOne({ email });
    console.log(admin.role);
    let userType = admin.role;

    if (!admin) {
      return handleErrorResponse(res, 404, "Admin not found");
    }

    const isPasswordValid = await checkPassword(password, admin.password);
    if (!isPasswordValid) {
      return handleErrorResponse(res, 401, "Invalid credentials");
    }

    const token = jwt.sign(
      { userId: admin._id, userType },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ message: "Login successful", token, userType });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
});

const addNewAdmin = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: "Please input all fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters long" });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newAdmin.save();
    res.status(201).json({ message: "New admin created successfully" });
  } catch (error) {
    console.error("Create Admin Error:", error);
    handleErrorResponse(res, 500, error.message);
  }
});

const deleteAdmin = asyncHandler(async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return handleErrorResponse(res, 404, "Admin not found");
    }
    admin.isActive = false;
    await admin.save();
    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
});

const addNewVendor = asyncHandler(async (req, res, next) => {
  try {
    const {
      name,
      email,
      occupation,
      experience,
      city,
      phone,
      password,
      confirmPassword,
    } = req.body;

    if (
      !name ||
      !email ||
      !occupation ||
      !experience ||
      !password ||
      !confirmPassword ||
      !city ||
      !phone
    ) {
      return handleErrorResponse(res, next, 400, "Please input all fields");
    }

    if (password.length < 6) {
      return handleErrorResponse(
        res,
        next,
        400,
        "Password should be at least 6 characters long"
      );
    }

    if (confirmPassword !== password) {
      return handleErrorResponse(res, next, 400, "Passwords do not match");
    }

    const existingUser = await User.findOne({ email });
    const existingVendor = await Vendor.findOne({ email });

    if (existingUser || existingVendor) {
      return handleErrorResponse(res, next, 409, "Email is already registered");
    }

    const hashedPassword = await hashPassword(password);
    const newVendor = new Vendor({
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
      isVerified: true,
      isDeleted: false,
    });

    await newVendor.save();
    res.status(201).json({ message: "Vendor created successfully" });
  } catch (error) {
    console.error("Create Vendor Error:", error);
    handleErrorResponse(res, next, 500, error.message);
  }
});

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find(
      { isDeleted: false },
      { username: 1, email: 1, _id: 0 }
    );
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  adminSignup,
  addNewAdmin,
  deleteAdmin,
  adminLogin,
  addNewVendor,
  getAllUsers,
};
