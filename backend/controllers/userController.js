const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    // req.user comes from the 'protect' middleware
    const currentUserId = req.user._id;
    
    // Find all users where ID is NOT equal ($ne) to current user
    const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");
    
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getAllUsers };