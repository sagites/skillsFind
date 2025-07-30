const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token found
  if (!token) {
    return res.status(401).json({ msg: "Not authorized to access this route" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find user in both collections
    // let account = await User.findById(decoded.userId).select("-password");
    // let accountType = "user";

    // if (!account) {
    //   account = await Vendor.findById(decoded.userId).select("-password");
    //   accountType = account ? "vendor" : null;
    // }

    let account;
    let accountType = null;

    account = await User.findById(decoded.userId).select("-password");

    if (account) {
      accountType = "user";
    } else {
      account = await Vendor.findById(decoded.userId).select("-password");
      if (account) accountType = "vendor";
    }

    // If account doesn't exist in either collection
    if (!account || !accountType) {
      return res.status(401).json({ msg: "Account not found" });
    }

    // Attach account info to request
    req.user = account;
    req.userId = account._id;
    req.accountType = accountType;


     // Log for testing
    console.log("Authenticated Request:");
    console.log("User ID:", req.userId.toString());
    console.log("Account Type:", req.accountType);

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ msg: "Not authorized to access this route" });
  }
};

module.exports = protect;
