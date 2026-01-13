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
    res.status(500).json({ message: "Failed to fetch issues" });
  }
});

router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const issues = await Issue.find({ userId }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user issues" });
  }
});

// 🔥 NEW: Get single issue with full details
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate("userId", "name email");
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch issue" });
  }
});

// 🔥 NEW: Update issue status (Admin only)
router.put("/:id/status", auth, async (req, res) => {
  try {
    const { status, note } = req.body;
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Update status
    issue.status = status;

    // Add to timeline
    issue.timeline.push({
      stage: status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });

    // If resolved, set resolvedAt
    if (status === "RESOLVED") {
      issue.resolvedAt = new Date();
    }

    await issue.save();
    res.json({ success: true, message: "Status updated", issue });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

// 🔥 NEW: Upload resolution proof (Admin only)
router.post("/:id/resolve", auth, upload.single("resolvedImage"), async (req, res) => {
  try {
    const { resolvedNote } = req.body;
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = "RESOLVED";
    issue.resolvedImage = req.file ? req.file.filename : null;
    issue.resolvedNote = resolvedNote;
    issue.resolvedAt = new Date();

    // Add to timeline
    issue.timeline.push({
      stage: "RESOLVED",
      timestamp: new Date(),
      note: resolvedNote || "Issue resolved",
    });

    await issue.save();
    res.json({ success: true, message: "Issue resolved", issue });
  } catch (err) {
    res.status(500).json({ message: "Failed to resolve issue" });
  }
});

// 🔥 NEW: Submit citizen feedback
router.post("/:id/feedback", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check if user owns this issue
    if (issue.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Check if issue is resolved
    if (issue.status !== "RESOLVED") {
      return res.status(400).json({ message: "Can only provide feedback for resolved issues" });
    }

    issue.feedback = {
      rating: rating,
      comment: comment,
      submittedAt: new Date(),
    };

    await issue.save();
    res.json({ success: true, message: "Feedback submitted", issue });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit feedback" });
  }
});

module.exports = router;
