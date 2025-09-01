const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookmarkedProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ userId: 1, bookmarkedProfile: 1 }, { unique: true });

bookmarkSchema.index({ userId: 1 });
bookmarkSchema.index({ bookmarkedProfile: 1 });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);
module.exports = Bookmark;
