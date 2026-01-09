const express = require("express");
const router = express.Router();

const Issue = require("../models/Issue");
const upload = require("../middleware/upload"); // ✅ MOST IMPORTANT LINE
const auth = require("../middleware/auth");

router.post(
  "/",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);
      console.log("USER:", req.user);

      const issue = new Issue({
        userId: req.user.id,
        category: req.body.category,
        description: req.body.description,
        priority: req.body.priority,
        location: req.body.location,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        image: req.file ? req.file.filename : null,
      });

      await issue.save();

      res.json({ message: "Issue submitted successfully" });
    } catch (err) {
      console.log("ISSUE ERROR:", err);
      res.status(500).json({ message: "Issue submit failed" });
    }
  }
);
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.log("FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
});

router.get("/my", auth, async (req, res) => {
  console.log("REQ.USER IN /my:", req.user);  // ⭐ Add this

  const userId = req.user.id;
  const issues = await Issue.find({ userId }).sort({ createdAt: -1 });

  res.json(issues);
});
module.exports = router;
