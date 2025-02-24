const Vendor = require("../models/Vendor");
const asyncHandler = require("express-async-handler");

const getAllVendors = asyncHandler(async (req, res) => {
  try {
    const users = await Vendor.find({}, { username: 1, email: 1, _id: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
    getAllVendors
}
