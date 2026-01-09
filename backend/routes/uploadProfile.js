const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const User = require("../models/Users");

const router = express.Router();

// Storage config
const storage = multer.diskStorage({
  destination: "./uploads/profilePics",
  filename: function (req, file, cb) {
    cb(null, "USER-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload route
router.post("/profile-pic", auth, upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) return res.json({ success: false, message: "No file uploaded" });

    const picPath = `/uploads/profilePics/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: picPath },
      { new: true }
    );

    res.json({ success: true, pic: picPath, user });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.json({ success: false, message: "Upload failed" });
  }
});

module.exports = router;