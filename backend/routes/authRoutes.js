const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  googleLogin,
} = require("../controllers/authController");

// Define the API endpoints
router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/google", googleLogin); // <--- This handles the synced data

module.exports = router;
