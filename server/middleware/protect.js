const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ msg: "Not authorized to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded JWT:", decoded); // Log the decoded token
    req.user = await User.findById(decoded.userId);
    // console.log(req.user);
    req.userId = req.user._id;
    next();
  } catch (error) {
    console.error("Error verifying token:", error); // Log any error
    return res.status(401).json({ msg: "Not authorized to access this route" });
  }
};

module.exports = protect;
