import Notification from "../models/Notification.js";

await Notification.create({
  userId: issue.userId,
  issueId: issue._id,
  title: "Complaint Updated",
  message: `Your complaint is now ${newStatus}.`,
});
