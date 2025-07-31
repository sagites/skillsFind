const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Admin = require("../models/admin");

/**
 * Get account and account type by userId
 * @param {String} userId - The ID from the decoded JWT
 * @returns {Object} { account, accountType }
 */
const getAccountType = async (userId) => {
  let account = await User.findById(userId).select("-password");

  if (account) {
    return { account, accountType: "user" };
  }

  account = await Vendor.findById(userId).select("-password");
  if (account) {
    return { account, accountType: "vendor" };
  }

  account = await Admin.findById(userId).select("-password");
  if (account) {
    return { account, accountType: account.role || "admin" }; // Use role if available, otherwise default to "admin"
  }

  return { account: null, accountType: null };
};

module.exports = getAccountType;