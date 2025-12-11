const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const { protect } = require("../middleware/authMiddleware");

// Create a new group
// POST /api/groups
// body: { name, memberIds: [userId1, userId2, ...] }
router.post("/", protect, async (req, res) => {
  try {
    const { name, memberIds } = req.body;

    if (!name || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Group name and members are required" });
    }

    // ensure creator is included as a member
    const uniqueMembers = Array.from(
      new Set([...memberIds, req.user._id.toString()])
    );

    const group = await Group.create({
      name,
      members: uniqueMembers,
      createdBy: req.user._id,
    });

    return res.status(201).json(group);
  } catch (err) {
    console.error("Error creating group:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get all groups current user belongs to
// GET /api/groups/my
router.get("/my", protect, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "username email")
      .sort({ updatedAt: -1 });

    return res.status(200).json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
