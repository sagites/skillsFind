const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Bookmark = require("../models/bookmarks")
const Vendor = require("../models/Vendor");
const { handleErrorResponse } = require("../utils/handleError");

// Bookmark a Profile
const bookmarkProfile = asyncHandler(async (req, res) => {
  const { profileId } = req.body;
  const userId = req.user._id;

  // Validate profileId format
  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    return handleErrorResponse(res, 400, "Invalid profile ID");
  }

  // Check if profile exists
  const profileExists = await Vendor.findById(profileId);
  if (!profileExists) {
    return handleErrorResponse(res, 404, "Profile not found");
  }

  // Check if already bookmarked
  const alreadyBookmarked = await Bookmark.findOne({
    userId,
    bookmarkedProfile: profileId,
  });
  if (alreadyBookmarked) {
    return handleErrorResponse(res, 400, "Profile already bookmarked");
  }

  // Create bookmark
  const bookmark = new Bookmark({ userId, bookmarkedProfile: profileId });
  await bookmark.save();

  res
    .status(201)
    .json({
      success: true,
      message: "Profile bookmarked successfully",
      bookmark,
    });
});

// Remove a Bookmark
const removeBookmark = asyncHandler(async (req, res) => {
  const { profileId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    return handleErrorResponse(res, 400, "Invalid profile ID");
  }

  const bookmark = await Bookmark.findOneAndDelete({
    userId,
    bookmarkedProfile: profileId,
  });

  if (!bookmark) {
    return handleErrorResponse(res, 404, "Bookmark not found");
  }

  res
    .status(200)
    .json({ success: true, message: "Bookmark removed successfully" });
});

// Get All Bookmarked Profiles for a User
const getBookmarkedProfiles = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const bookmarks = await Bookmark.find({ userId })
    .populate("bookmarkedProfile", "name email profile")
    .lean();

  if (bookmarks.length === 0) {
    return handleErrorResponse(res, 404, "No bookmarks found");
  }

  res
    .status(200)
    .json({
      success: true,
      message: "Bookmarked profiles retrieved",
      bookmarks,
    });
});

module.exports = { bookmarkProfile, removeBookmark, getBookmarkedProfiles };
