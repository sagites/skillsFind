const authorize = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.accountType) {
      return res.status(401).json({ message: "Unauthorized: No account type found" });
    }

    if (!allowedTypes.includes(req.accountType)) {
      return res.status(403).json({ message: "Forbidden: You do not have access" });
    }

    next();
  };
};

module.exports = {authorize};
