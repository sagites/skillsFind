const router = require("express").Router();
const protect = require("../middleware/protect");
const ROLES = require("../utils/roles");
const { authorize } = require("../middleware/roleMiddleware");
const {
  bookmarkProfile,
  removeBookmark,
  getBookmarkedProfiles,
} = require("../controller/bookmarkController");

router
  .route("/")
  .post(protect, authorize(ROLES.USER), bookmarkProfile)
  .delete(protect, authorize(ROLES.USER), removeBookmark)
  .get(protect, authorize(ROLES.USER), getBookmarkedProfiles);

module.exports = router;