import Issue from "../models/Issue.js";
import Notification from "../models/Notification.js";

export const getAdminStats = async (req, res) => {
  const total = await Issue.countDocuments();
  const pending = await Issue.countDocuments({ status: "PENDING" });
  const review = await Issue.countDocuments({ status: "IN_REVIEW" });
  const resolved = await Issue.countDocuments({ status: "RESOLVED" });

  res.json({ total, pending, review, resolved });
};

export const getAdminIssues = async (req, res) => {
  const issues = await Issue.find().sort({ createdAt: -1 });
  res.json(issues);
};

export const updateIssueStatus = async (req, res) => {
  const { status } = req.body;

  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  // Create notification for user
  await Notification.create({
    userId: issue.userId,
    issueId: issue._id,
    title: "Complaint Update",
    message: `Your complaint is now ${status}.`
  });

  res.json({ success: true, issue });
};
