const User = require("../models/Users");
const path = require("path");
const fs = require("fs");

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, address } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phone, address },
            { new: true, runValidators: true }
        ).select("-password");

        return res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.log("UPDATE ERROR:", err);
        return res.json({ success: false, message: "Backend error" });
    }
};

// Upload Profile Picture
exports.uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "No image uploaded" });
        }

        // path relative to server root
        const filePath = `/uploads/profilePics/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { profilePic: filePath },
            { new: true }
        ).select("-password");

        res.json({
            success: true,
            profilePic: filePath,
            user: updatedUser
        });

    } catch (err) {
        console.log("UPLOAD ERROR:", err);
        res.json({ success: false, message: "Upload failed" });
    }
};
