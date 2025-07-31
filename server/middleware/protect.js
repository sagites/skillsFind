const jwt = require("jsonwebtoken");
const getAccountType = require("../utils/getAccountType");

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

    const { account, accountType } = await getAccountType(decoded.userId);

    // If account doesn't exist in any collection
    if (!account || !accountType) {
      return res.status(401).json({ msg: "Account not found" });
    }

    // Attach account info to request
    req.user = account;
    req.userId = account._id;
    req.accountType = accountType;

    //Log for testing
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