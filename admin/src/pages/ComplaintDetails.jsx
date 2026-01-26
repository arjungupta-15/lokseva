import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { API_URL } from "../api";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  Chip,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function ComplaintDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [resolvedNote, setResolvedNote] = useState("");
  const [resolvedImage, setResolvedImage] = useState(null);

  const loadIssue = async () => {
    const res = await fetch(`${API_URL}/api/issues/${id}`);
    setIssue(await res.json());
  };

  const updateStatus = async () => {
    if (!newStatus) {
      alert("Please select a status");
      return;
    }

    const token = localStorage.getItem("adminToken");
    await fetch(`${API_URL}/api/issues/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus, note: statusNote }),
    });

    setNewStatus("");
    setStatusNote("");
    loadIssue();
    alert("Status updated successfully!");
  };

  const resolveIssue = async () => {
    const token = localStorage.getItem("adminToken");
    const formData = new FormData();
    formData.append("resolvedNote", resolvedNote);
    if (resolvedImage) {
      formData.append("resolvedImage", resolvedImage);
    }

    await fetch(`${API_URL}/api/issues/${id}/resolve`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    setOpenDialog(false);
    setResolvedNote("");
    setResolvedImage(null);
    loadIssue();
    alert("Issue resolved successfully!");
  };

  useEffect(() => {
    loadIssue();
  }, []);

  if (!issue) return <Box sx={{ p: 3 }}>Loading...</Box>;

  const getStatusColor = (status) => {
    switch (status) {
      case "SUBMITTED":
        return "warning";
      case "ACKNOWLEDGED":
        return "info";
      case "IN_PROGRESS":
        return "primary";
      case "RESOLVED":
        return "success";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />

        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Issue Details
          </Typography>

          {/* Issue Info Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h5">{issue.category}</Typography>
                <Chip label={issue.status} color={getStatusColor(issue.status)} />
              </Box>

              <Typography variant="body1" paragraph>
                {issue.description}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Location:</strong> {issue.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Priority:</strong> {issue.priority}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Reported:</strong>{" "}
                {new Date(issue.createdAt).toLocaleString()}
              </Typography>

              {issue.image && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Reported Issue Photo:
                  </Typography>
                  <img
                    src={`${API_URL}/uploads/${issue.image}`}
                    alt="Issue"
                    style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8 }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Timeline Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Progress Timeline
              </Typography>

              {issue.timeline && issue.timeline.length > 0 ? (
                <Timeline>
                  {issue.timeline.map((item, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent color="text.secondary">
                        {new Date(item.timestamp).toLocaleString()}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot color={getStatusColor(item.stage)} />
                        {index < issue.timeline.length - 1 && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography variant="h6" component="span">
                          {item.stage}
                        </Typography>
                        <Typography>{item.note}</Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              ) : (
                <Typography color="text.secondary">No timeline updates yet</Typography>
              )}
            </CardContent>
          </Card>

          {/* Resolution Proof */}
          {issue.status === "RESOLVED" && issue.resolvedImage && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resolution Proof (After Photo)
                </Typography>
                <img
                  src={`${API_URL}/uploads/${issue.resolvedImage}`}
                  alt="Resolved"
                  style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8 }}
                />
                {issue.resolvedNote && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Note:</strong> {issue.resolvedNote}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}

          {/* Citizen Feedback */}
          {issue.feedback && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Citizen Feedback
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Typography variant="h5" sx={{ mr: 1 }}>
                    {issue.feedback.rating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    / 5 stars
                  </Typography>
                </Box>
                {issue.feedback.comment && (
                  <Typography variant="body2" paragraph>
                    "{issue.feedback.comment}"
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                  Submitted: {new Date(issue.feedback.submittedAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Update Status Section */}
          {issue.status !== "RESOLVED" && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Update Status
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>New Status</InputLabel>
                  <Select
                    value={newStatus}
                    label="New Status"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="SUBMITTED">Submitted</MenuItem>
                    <MenuItem value="ACKNOWLEDGED">Acknowledged</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Status Note"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="contained" onClick={updateStatus}>
                    Update Status
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => setOpenDialog(true)}
                  >
                    Mark as Resolved
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Resolve Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Resolve Issue</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Resolution Note"
                value={resolvedNote}
                onChange={(e) => setResolvedNote(e.target.value)}
                sx={{ mt: 2, mb: 2 }}
              />

              <Button variant="outlined" component="label" fullWidth>
                Upload After Photo (Optional)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setResolvedImage(e.target.files[0])}
                />
              </Button>

              {resolvedImage && (
                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  Selected: {resolvedImage.name}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button onClick={resolveIssue} variant="contained" color="success">
                Resolve Issue
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}
