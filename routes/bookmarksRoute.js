const router = require("express").Router();
const protect = require("../middleware/protect")
const {
  bookmarkProfile,
  removeBookmark,
  getBookmarkedProfiles,
} = require("../controller/bookmarkController");

router
  .route("/")
  .post(protect, bookmarkProfile)
  .delete(protect, removeBookmark)
  .get(protect, getBookmarkedProfiles);

module.exports = router