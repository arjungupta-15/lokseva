import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { API_URL } from "../api";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";

export default function Dashboard() {
  const [stats, setStats] = useState({});

  const loadStats = async () => {
    const res = await fetch(`${API_URL}/admin/stats`);
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const card = (title, value, color) => (
    <Grid item xs={12} md={3}>
      <Card sx={{ background: color, color: "#fff" }}>
        <CardContent>
          <Typography variant="h4">{value}</Typography>
          <Typography>{title}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 ,marginLeft: "220px"}}>
        <Topbar />

        <Box sx={{ p: 3 }}>
          <h2>Dashboard</h2>

          <Grid container spacing={3}>
            {card("Total", stats.total, "#1976d2")}
            {card("Pending", stats.pending, "#ffa726")}
            {card("In Review", stats.review, "#42a5f5")}
            {card("Resolved", stats.resolved, "#66bb6a")}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
