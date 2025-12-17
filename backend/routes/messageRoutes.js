const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/messages/UserID_UserID
router.get("/:roomId", protect, getMessages);

module.exports = router;