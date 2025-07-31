const mongoose = require("mongoose");
const Vendor = require("./Vendor");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


// Helper function to update vendor rating
async function updateVendorRating(vendorId) {
  const stats = await mongoose.model("Review").aggregate([
    { $match: { vendor: vendorId } },
    {
      $group: {
        _id: "$vendor",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Vendor.findByIdAndUpdate(vendorId, {
      averageRating: stats[0].averageRating,
      reviewCount: stats[0].reviewCount
    });
  } else {
    await Vendor.findByIdAndUpdate(vendorId, { averageRating: 0, reviewCount: 0 });
  }
}

// Update rating after saving a review
reviewSchema.post("save", async function () {
  await updateVendorRating(this.vendor);
});

// Update rating after removing a review
reviewSchema.post("remove", async function () {
  await updateVendorRating(this.vendor);
});


module.exports = mongoose.model("Review", reviewSchema);
