const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/Users");
const multer = require("multer");

// STORAGE FOR PROFILE PICS
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, "profile_" + Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// 📌 Upload Profile Picture
router.post("/upload-pic", auth, upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No image uploaded" });
    }

    const filePath = "/uploads/" + req.file.filename;

    await User.findByIdAndUpdate(req.user.id, {
      profilePic: filePath
    });

    res.json({
      success: true,
      profilePic: filePath
    });

  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Upload error" });
  }
});

module.exports = router;