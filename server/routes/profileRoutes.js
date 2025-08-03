const ROLES = require("../utils/roles");
const router = require("express").Router();
const protect = require("../middleware/protect");
const { authorize } = require("../middleware/roleMiddleware");
const {
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controller/profileController");

router
  .route("/")
  .get(
    protect,
    authorize(ROLES.USER, ROLES.VENDOR, ROLES.ADMIN, ROLES.SUPERADMIN),
    getProfile
  )
  .put(
    protect,
    authorize(ROLES.USER, ROLES.VENDOR, ROLES.ADMIN, ROLES.SUPERADMIN),
    updateProfile
  )
  .delete(
    protect,
    authorize(ROLES.USER, ROLES.VENDOR, ROLES.ADMIN, ROLES.SUPERADMIN),
    deleteProfile
  );

module.exports = router;
