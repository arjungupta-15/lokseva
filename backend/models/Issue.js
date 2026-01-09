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

  image: String,
  latitude: Number,
  longitude: Number,

  status: {
    type: String,
    default: "PENDING",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Issue", IssueSchema);
