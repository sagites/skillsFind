const express = require("express");

const auth = require("./authRoutes");
const email = require("./verifyEmail");
const reviews = require("./reviewRoutes");
const admin = require("./adminRoutes");
const bookmarks = require("./bookmarksRoute");
const profile = require("./profileRoutes");
const forgotPassword = require("./forgotPasswordRoutes");
const serviceProviders = require("./listAllServiceProvidersRoutes");

const router = express.Router();

router.use("/auth", auth);
router.use("/admin", admin);
router.use("/email", email);
router.use("/profile", profile);
router.use("/reviews", reviews);
router.use("/bookmark", bookmarks);
router.use("/forgot-password", forgotPassword);
router.use("/serviceProvidersList", serviceProviders);

module.exports = router;
