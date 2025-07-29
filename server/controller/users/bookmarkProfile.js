const User = require("../models/User");
const Vendor = require("../models/Vendor");
const { handleErrorResponse } = require("../utils/errorHandler");

// Bookmark a vendor
const bookmarkVendor = async (req, res) => {
  const { vendorId } = req.body;

  try {
    const user = await User.findById(req.userId);
    const vendor = await Vendor.findById(vendorId);

    if (!user || !vendor) {
      return handleErrorResponse(res, 404, "User or Vendor not found");
    }

    if (user.bookmarkedVendors.includes(vendorId)) {
      return handleErrorResponse(res, 400, "Vendor already bookmarked");
    }

    user.bookmarkedVendors.push(vendorId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor bookmarked successfully",
      bookmarkedVendors: user.bookmarkedVendors,
    });
  } catch (error) {
    console.error(error);
    handleErrorResponse(res, 500, "Internal Server Error");
  }
};

// Unbookmark a vendor
const unbookmarkVendor = async (req, res) => {
  const { vendorId } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }

    if (!user.bookmarkedVendors.includes(vendorId)) {
      return handleErrorResponse(res, 400, "Vendor is not bookmarked");
    }

    user.bookmarkedVendors.pull(vendorId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor unbookmarked successfully",
      bookmarkedVendors: user.bookmarkedVendors,
    });
  } catch (error) {
    console.error(error);
    handleErrorResponse(res, 500, "Internal Server Error");
  }
};

// Get all bookmarked vendors for a user
const getBookmarkedVendors = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("bookmarkedVendors");
    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }

    res.status(200).json({
      success: true,
      bookmarkedVendors: user.bookmarkedVendors,
    });
  } catch (error) {
    console.error(error);
    handleErrorResponse(res, 500, "Internal Server Error");
  }
};

module.exports = { bookmarkVendor, unbookmarkVendor, getBookmarkedVendors };
