const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getProfile, updateProfile, uploadProfilePic } = require("../controllers/profile.controller");
const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({
    destination: "uploads/profilePics",
    filename: (req, file, cb) => {
        cb(null, "profile_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
router.get("/", auth, getProfile);
router.put("/update", auth, updateProfile);
router.post("/upload-pic", auth, upload.single("profilePic"), uploadProfilePic);

module.exports = router;
