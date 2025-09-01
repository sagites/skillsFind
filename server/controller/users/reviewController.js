const asyncHandler = require("express-async-handler");
const Vendor = require("../../models/Vendor");
const Review = require("../../models/review");
const { handleErrorResponse } = require("../../utils/handleError");

// Create a review
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { userId } = req;
  const { vendorId } = req.params;

  if (!rating || rating < 1 || rating > 5) {
    return handleErrorResponse(res, 400, "Rating must be between 1 and 5");
  }

  // Check vendor + existing review in parallel
  const [vendorExists, existingReview] = await Promise.all([
    Vendor.findById(vendorId).select("averageRating reviewCount"),
    Review.exists({ user: userId, vendor: vendorId }),
  ]);

  if (!vendorExists) {
    return handleErrorResponse(res, 404, "Vendor not found");
  }

  if (existingReview) {
    return handleErrorResponse(res, 400, "You have already reviewed this vendor");
  }

  // Create review
  const review = await Review.create({
    user: userId,
    vendor: vendorId,
    rating,
    comment,
  });

  // Update vendor rating in one step
  const totalRating =
    (vendorExists.averageRating || 0) * (vendorExists.reviewCount || 0) + rating;

  vendorExists.reviewCount = (vendorExists.reviewCount || 0) + 1;
  vendorExists.averageRating = totalRating / vendorExists.reviewCount;
  await vendorExists.save();

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    data: review,
  });
});

// Get all reviews for a vendor
const getReviews = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  // Run vendor + reviews query in parallel
  const [vendor, reviews] = await Promise.all([
    Vendor.findById(vendorId).select("averageRating reviewCount"),
    Review.find({ vendor: vendorId }).populate("user", "name email").lean(),
  ]);

  if (!vendor) {
    return handleErrorResponse(res, 404, "Vendor not found");
  }

  res.status(200).json({
    success: true,
    count: reviews.length,
    averageRating: vendor.averageRating,
    data: reviews,
  });
});

module.exports = { createReview, getReviews };
