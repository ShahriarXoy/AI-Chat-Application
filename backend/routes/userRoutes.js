const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// We protect this route so only logged-in users can see the list
router.get("/", protect, getAllUsers);

module.exports = router;