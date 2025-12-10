const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// We protect this route so only logged-in users can see the list
router.get("/", protect, getAllUsers);

// Search for a user by username (new feature)
router.get("/search", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username query is required" });
    }

    // Case-insensitive search for the username
    const user = await User.findOne({ username: new RegExp(`^${username}$`, "i") })
      .select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error searching for user:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
