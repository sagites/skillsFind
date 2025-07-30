const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const handleErrorResponse = require("../utils/handleErrorResponse"); // Assuming you use this helper

const updateUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, profile } = req.body;

    // Ensure the user is authenticated
    const userId = req.userId; // comes from `protect` middleware
    const user = await User.findById(userId);

    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }

    // Check if email is being updated and if it's already in use
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return handleErrorResponse(res, 400, "Email is already in use");
      }
      user.email = email;
    }

    // Update other fields
    if (name) user.name = name;

    if (profile) {
      if (profile.phone) user.profile.phone = profile.phone;
      if (profile.address) user.profile.address = profile.address;
      if (profile.profilePicture)
        user.profile.profilePicture = profile.profilePicture;
    }

    // Save updated user
    const updatedUser = await user.save();

    // Return response without sensitive fields
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profile: updatedUser.profile,
        createdAt: updatedUser.createdAt,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
});

module.exports = updateUser;
