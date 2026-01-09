import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { API_URL } from "../api";
import { Box, Button } from "@mui/material";

export default function ComplaintDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);

  const loadIssue = async () => {
    const res = await fetch(`${API_URL}/api/issues/${id}`);
    setIssue(await res.json());
  };

  const updateStatus = async (status) => {
    await fetch(`${API_URL}/admin/updateStatus/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadIssue();
  };

  useEffect(() => {
    loadIssue();
  }, []);

  if (!issue) return "Loading...";

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Topbar />

        <Box sx={{ p: 3 }}>
          <h2>{issue.category}</h2>
          <p>{issue.description}</p>
          <p><b>Status:</b> {issue.status}</p>

          <Button sx={{ mr: 2 }} variant="outlined"
            onClick={() => updateStatus("IN_REVIEW")}
          >
            Mark In Review
          </Button>

          <Button variant="contained" color="success"
            onClick={() => updateStatus("RESOLVED")}
          >
            Resolve
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
