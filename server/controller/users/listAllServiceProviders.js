const asyncHandler = require("express-async-handler");
const Vendor = require("../../models/Vendor");
const { handleErrorResponse } = require("../../utils/handleError");

const listAllServiceProviders = asyncHandler(async (req, res) => {
  try {
    const vendors = await Vendor.find({ isVerified: true }).select("-password -__v -verifyTokenExpiry -verifyToken -forgotPasswordToken -forgotPasswordTokenExpiry");
    if (!vendors || vendors.length === 0) {
      return handleErrorResponse(res, 404, "No service providers found");
    }
    res.status(200).json({
      success: true,
      message: "Service providers retrieved successfully",
      vendors,
    });
  } catch (error) {
    console.error("Error retrieving service providers:", error);
    handleErrorResponse(res, 500, "Internal server error");
  }
});


module.exports = { listAllServiceProviders };