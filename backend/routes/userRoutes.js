const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// We protect this route so only logged-in users can see the list
router.get("/", protect, getAllUsers);

// Get current user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload profile picture (Base64)
router.post("/upload-picture", protect, async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ message: "No picture provided" });
    }

    // Update user profile picture
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true }
    ).select("-password");

    res.json({ message: "Picture uploaded successfully", user });
  } catch (err) {
    console.error("Error uploading picture:", err);
    res.status(500).json({ message: "Server error" });
  }
});

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
