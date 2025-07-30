const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Vendor = require("../models/Vendor");
const { handleErrorResponse } = require("../utils/handleError");
const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { name, email, profile } = req.body;
    const { accountType } = req.user;
    const accountId = req.userId;

    // Pick model dynamically
    const Model = accountType === "vendor" ? Vendor : User;
    const account = await Model.findById(accountId);

    if (!account) {
      return handleErrorResponse(res, 404, `${accountType} not found`);
    }

    // Check if email is being updated and ensure it's unique
    if (email && email !== account.email) {
      const emailExists = await Model.findOne({ email });
      if (emailExists) {
        return handleErrorResponse(res, 400, "Email is already in use");
      }
      account.email = email;
    }

    if (name) account.name = name;

    if (profile) {
      Object.keys(profile).forEach((key) => {
        account.profile[key] = profile[key]; // Dynamically update profile
      });
    }

    // Save updated document
    const updatedAccount = await account.save();

    // Return sanitized response
    res.status(200).json({
      success: true,
      message: `${accountType} profile updated successfully`,
      data: {
        _id: updatedAccount._id,
        name: updatedAccount.name,
        email: updatedAccount.email,
        role: updatedAccount.role || "user",
        profile: updatedAccount.profile,
        createdAt: updatedAccount.createdAt,
        isVerified: updatedAccount.isVerified,
      },
    });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
});

module.exports = updateProfile;
