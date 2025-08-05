const router = require("express").Router();
const ROLES = require("../utils/roles")
const protect = require("../middleware/protect");
const { authorize } = require("../middleware/roleMiddleware");
const {
  adminSignup,
  addNewAdmin,
  adminLogin,
  deleteAdmin,
  addNewVendor,
  getAllUsers,
} = require("../controller/adminController");

router.post("/login", adminLogin)
      .post("/signup", adminSignup);
router.post("/add-admin", protect, authorize(ROLES.SUPERADMIN), addNewAdmin);
router.post("/add-vendor", protect, authorize(ROLES.SUPERADMIN), addNewVendor);
router.delete("/remove-admin/:adminId", protect, authorize(ROLES.SUPERADMIN), deleteAdmin);
router.route("/users/").get(protect, authorize(ROLES.ADMIN, ROLES.SUPERADMIN), getAllUsers);

module.exports = router;
