const router = require("express").Router();
const protect = require("../middleware/protect");
const { authorize } = require("../middleware/roleMiddleware");
const {
  bookmarkProfile,
  removeBookmark,
  getBookmarkedProfiles,
} = require("../controller/bookmarkController");

router
  .route("/")
  .post(protect, authorize("user"), bookmarkProfile)
  .delete(protect, authorize("user"), removeBookmark)
  .get(protect, authorize("user"), getBookmarkedProfiles);

module.exports = router;