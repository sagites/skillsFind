const router = require("express").Router();
const protect = require("../middleware/protect");
const { authorize } = require("../middleware/roleMiddleware");
const {
  adminSignup,
  adminLogin,
  getAllUsers,
} = require("../controller/adminController");

router.route("/users/").get(protect, authorize("admin"), getAllUsers);
router.post("/login", adminLogin).post("/signup", adminSignup);

module.exports = router;
