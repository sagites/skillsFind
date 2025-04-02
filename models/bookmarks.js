const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who is bookmarking
    bookmarkedProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, // The profile being bookmarked
  },
  { timestamps: true }
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = Bookmark;
