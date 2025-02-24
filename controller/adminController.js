const expressAsyncHandler = require("express-async-handler");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getAllUsers = asyncHandler( async (req, res) => {
    try {
        const users = await User.find({}, { username: 1, email: 1, _id: 0 });
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
});


module.exports = {
    getAllUsers
}