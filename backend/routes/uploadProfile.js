const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const User = require("../models/Users");

const router = express.Router();

// Storage: uploads/profilePics
const storage = multer.diskStorage({
  destination: "uploads/profilePics",
  filename: (req, file, cb) => {
    cb(null, "profile_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 📌 Upload profile picture
router.post("/upload-pic", auth, upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    const filePath = `/uploads/profilePics/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: filePath },
      { new: true }
    );

    res.json({
      success: true,
      profilePic: filePath,
      user
    });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.json({ success: false, message: "Upload failed" });
  }
});

module.exports = router;
