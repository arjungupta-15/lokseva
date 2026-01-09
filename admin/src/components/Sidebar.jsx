import { Link, useLocation } from "react-router-dom";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Complaints", path: "/complaints" },
  ];

  return (
    <Box
      sx={{
        width: 220,
        height: "100vh",
        bgcolor: "#1E1E2F",
        color: "#fff",
        position: "fixed",
        left: 0,
        top: 0,
        paddingTop: "20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Admin Panel</h2>

      <List>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              color: pathname === item.path ? "#90caf9" : "#fff",
              bgcolor: pathname === item.path ? "rgba(255,255,255,0.1)" : "",
              borderRadius: "8px",
              margin: "6px 10px",
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
