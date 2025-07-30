const asyncHandler = require("express-async-handler");
const Vendor = require("../../models/Vendor");
const { handleErrorResponse } = require("../../utils/handleError");

const listAllServiceProviders = asyncHandler(async (req, res) => {
  try {
    const vendors = await Vendor.find({ isVerified: false }).select(
      "-password -__v -verifyTokenExpiry -verifyToken -forgotPasswordToken -forgotPasswordTokenExpiry"
    );
    if (!vendors || vendors.length === 0) {
      return handleErrorResponse(res, 404, "No service providers found");
    }
    res.status(200).json({
      success: true,
      message: "Service providers retrieved successfully",
      data: vendors,
    });
  } catch (error) {
    console.error("Error retrieving service providers:", error);
    handleErrorResponse(res, 500, "Internal server error");
  }
});

const getServiceProvider = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return handleErrorResponse(res, 400, "Service provider ID is required");
    }

    const vendor = await Vendor.findById(id).select(
      "-password -__v -verifyTokenExpiry -verifyToken -forgotPasswordToken -forgotPasswordTokenExpiry"
    );

    if (!vendor) {
      return handleErrorResponse(res, 404, "Service provider not found");
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    handleErrorResponse(res, 500, error.message);
  }
});

module.exports = { listAllServiceProviders, getServiceProvider };
