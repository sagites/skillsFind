const asyncHandler = require("express-async-handler");
const Vendor = require("../../models/Vendor");
const Review = require("../../models/review");
const { handleErrorResponse } = require("../../utils/handleError");

// Create a review
const createReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { userId } = req;
    const { vendorId } = req.params;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return handleErrorResponse(res, 400, "Rating must be between 1 and 5");
    }

    // Find vendor
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return handleErrorResponse(res, 404, "Vendor not found");
    }

    // Check if user already reviewed this vendor
    const existingReview = await Review.findOne({ user: userId, vendor: vendorId });
    if (existingReview) {
      return handleErrorResponse(res, 400, "You have already reviewed this vendor");
    }

    // Create and save review
    const review = new Review({
      user: userId,
      vendor: vendorId,
      rating,
      comment,
    });
    await review.save();

    // Update vendor's rating stats
    const totalRating = (vendor.averageRating || 0) * (vendor.reviewCount || 0) + rating;
    vendor.reviewCount = (vendor.reviewCount || 0) + 1;
    vendor.averageRating = totalRating / vendor.reviewCount;
    await vendor.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    console.error("Create Review Error:", error);
    handleErrorResponse(res, 500, error.message);
  }
});

// Get all reviews for a vendor
const getReviews = asyncHandler(async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Check if vendor exists
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return handleErrorResponse(res, 404, "Vendor not found");
    }

    // Fetch reviews from Review collection
    const reviews = await Review.find({ vendor: vendorId }).populate("user", "name email");

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: vendor.averageRating,
      data: reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);
    handleErrorResponse(res, 500, error.message);
  }
});

module.exports = { createReview, getReviews };
