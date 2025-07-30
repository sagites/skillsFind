const asyncHandler = require("express-async-handler");
const User = require("../../models/User");
const Vendor = require("../../models/Vendor");
const { handleErrorResponse } = require("../../utils/handleError");

const createReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    // const { accountType } = req.user;
    const accountId = req.userId;
    const vendorId = req.params.vendorId;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return handleErrorResponse(res, 400, "Rating must be between 1 and 5");
    }

    // Find the vendor to review
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return handleErrorResponse(res, 404, "Vendor not found");
    }

    // Create the review
    const review = {
      user: accountId,
      vendor: vendorId,
      rating,
      comment,
      createdAt: new Date(),
    };

    // Add review to vendor's reviews array
    // vendor.reviews.push(review);

    // Update vendor's average rating and review count
    vendor.averageRating =
      (vendor.averageRating * vendor.reviewCount + rating) /
      (vendor.reviewCount + 1);
    vendor.reviewCount += 1;

    // Save the updated vendor document
    await vendor.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
});

module.exports = { createReview };