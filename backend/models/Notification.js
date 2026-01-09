import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },

  title: String,
  message: String,

  isRead: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);