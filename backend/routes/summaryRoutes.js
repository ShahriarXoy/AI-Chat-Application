const express = require("express");
const router = express.Router();
const { generateSummery } = require("../controllers/summaryController");

//post/api/summery/generate
router.post("/generate", generateSummery);

module.exports = router;