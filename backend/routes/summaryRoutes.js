const express = require("express");
const router = express.Router();
const { generateSummary } = require("../controllers/summaryController");

//post/api/summary/generate
router.post("/generate", generateSummary);

module.exports = router;