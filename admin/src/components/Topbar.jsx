import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    nav("/login");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 60,
        bgcolor: "#fff",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingRight: "20px",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 99,
      }}
    >
      <Button variant="outlined" color="error" onClick={logout}>
        Logout
      </Button>
    </Box>
  );
}
