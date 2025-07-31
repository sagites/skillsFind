const ROLES = require("../utils/roles");

/**
 * Role-based authorization middleware
 * @param {...string} allowedRoles - Roles allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.accountType;

    if (!allowedRoles.includes(userRole)) {
      console.warn(
        `Unauthorized access attempt | UserID: ${req.userId} | Role: ${userRole} | Allowed: ${allowedRoles.join(", ")}`
      );

      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this resource",
      });
    }

    next();
  };
};

module.exports = {authorize};
