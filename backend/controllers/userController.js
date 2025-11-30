// controllers/userController.js
const User = require("../models/User");

// GET /api/users - list all users except the logged in one
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "_id username email"
    );
    return res.json(users);
  } catch (err) {
    console.error("Get users error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getUsers };
