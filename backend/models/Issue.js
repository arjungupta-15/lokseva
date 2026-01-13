const mongoose = require("mongoose");

const IssueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  category: String,
  description: String,
  location: String,
  priority: {
    type: String,
    enum: ["HIGH", "MEDIUM", "LOW"],
  },

  image: String, // Before photo
  latitude: Number,
  longitude: Number,

  // 🔥 NEW: Multi-stage workflow
  status: {
    type: String,
    enum: ["SUBMITTED", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED", "REJECTED"],
    default: "SUBMITTED",
  },

  // 🔥 NEW: Progress tracking timeline
  timeline: [
    {
      stage: String, // SUBMITTED, ACKNOWLEDGED, IN_PROGRESS, RESOLVED
      timestamp: { type: Date, default: Date.now },
      note: String, // Admin note for this stage
    },
  ],

  // 🔥 NEW: Resolution proof
  resolvedImage: String, // After photo
  resolvedNote: String, // Admin's resolution note
  resolvedAt: Date,

  // 🔥 NEW: Citizen feedback
  feedback: {
    rating: { type: Number, min: 1, max: 5 }, // 1-5 stars
    comment: String,
    submittedAt: Date,
  },

  // 🔥 NEW: Assignment
  assignedTo: String, // Admin/Department name
  assignedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Issue", IssueSchema);
