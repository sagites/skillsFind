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
  addNewUser,
  getAllUsers,
} = require("../controller/adminController");

router.post("/login", adminLogin)
      .post("/signup", adminSignup);
router.post("/add-admin", protect, authorize(ROLES.SUPERADMIN), addNewAdmin);
router.post("/add-vendor", protect, authorize(ROLES.SUPERADMIN), addNewVendor);
router.post("/add-user", protect, authorize(ROLES.SUPERADMIN), addNewUser);
router.delete("/remove-admin/:adminId", protect, authorize(ROLES.SUPERADMIN), deleteAdmin);
router.get("/users/", protect, authorize(ROLES.ADMIN, ROLES.SUPERADMIN), getAllUsers);

module.exports = router;
