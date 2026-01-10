const express = require("express");
const auth = require("../middleware/auth");
const { signup, updateProfile } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", signup);

// 🔥 IMPORTANT: this route MUST EXIST
router.put("/update", auth, updateProfile);

module.exports = router;
