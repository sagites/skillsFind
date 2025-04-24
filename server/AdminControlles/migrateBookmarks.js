const mongoose = require("mongoose");
const User = require("./models/User");
const Bookmark = require("./models/Bookmark");
require("dotenv").config(); // Load your DB URI

const migrateBookmarks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({ bookmarkedVendors: { $exists: true, $ne: [] } });

    for (const user of users) {
      const vendorIds = user.bookmarkedVendors;

      for (const vendorId of vendorIds) {
        // Avoid inserting duplicates
        const exists = await Bookmark.findOne({ userId: user._id, vendorId });
        if (!exists) {
          await Bookmark.create({ userId: user._id, vendorId });
          console.log(`Migrated vendor ${vendorId} for user ${user._id}`);
        }
      }

      // Optional: remove the old bookmarkedVendors field
      user.bookmarkedVendors = [];
      await user.save();
    }

    console.log("Migration completed ✅");
    process.exit();
  } catch (err) {
    console.error("Migration failed ❌", err);
    process.exit(1);
  }
};

migrateBookmarks();
