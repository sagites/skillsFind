const mongoose = require("mongoose");
const Bookmark = require("../models/bookmarks");
const Vendor = require("../models/Vendor");
const { handleErrorResponse } = require("../utils/handleError");

// Bookmark a Profile
const bookmarkProfile = async (req, res, next) => {
  const { profileId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    return handleErrorResponse(res, next, 400, "Invalid profile ID");
  }

  try {
    // Check if vendor exists + already bookmarked in parallel
    const [profileExists, alreadyBookmarked] = await Promise.all([
      Vendor.exists({ _id: profileId }),
      Bookmark.exists({ userId, bookmarkedProfile: profileId }),
    ]);

    if (!profileExists) {
      return handleErrorResponse(res, next, 404, "Profile not found");
    }

    if (alreadyBookmarked) {
      return handleErrorResponse(res, next, 400, "Profile already bookmarked");
    }

    // Create bookmark
    const bookmark = await Bookmark.create({ userId, bookmarkedProfile: profileId });

    res.status(201).json({
      success: true,
      message: "Profile bookmarked successfully",
      bookmark,
    });
  } catch (error) {
    handleErrorResponse(res, next, 500, error.message);
  }
};

// Remove a Bookmark
const removeBookmark = async (req, res, next) => {
  const { profileId } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    return handleErrorResponse(res, next, 400, "Invalid profile ID");
  }

  try {
    await Bookmark.deleteOne({ userId, bookmarkedProfile: profileId });

    // Always return success (idempotent)
    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    handleErrorResponse(res, next, 500, error.message);
  }
};

// Get All Bookmarked Profiles for a User
const getBookmarkedProfiles = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const bookmarks = await Bookmark.find({ userId })
      .populate("bookmarkedProfile", "name email profile -_id") // only needed fields
      .lean();

    res.status(200).json({
      success: true,
      message: bookmarks.length > 0 ? "Bookmarked profiles retrieved" : "No bookmarks found",
      bookmarks,
    });
  } catch (error) {
    handleErrorResponse(res, next, 500, error.message);
  }
};

module.exports = {
  bookmarkProfile,
  removeBookmark,
  getBookmarkedProfiles,
};
