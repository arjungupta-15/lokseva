import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();
      if (!data.success) return alert(data.error);

      localStorage.setItem("adminToken", data.token);
      nav("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#eef2f3",
        overflow: "hidden", // <-- IMPORTANT FIX
      }}
    >
      <Box
        sx={{
          width: 380,
          background: "#fff",
          padding: "35px 30px",
          borderRadius: "12px",
          boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="700"
          textAlign="center"
          mb={2}
          color="#1E1E2F"
        >
          Admin Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          onChange={(e) => setPass(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            mt: 3,
            padding: "10px",
            fontWeight: "600",
            fontSize: "15px",
            borderRadius: "10px",
          }}
          onClick={handleLogin}
        >
          LOGIN
        </Button>
      </Box>
    </Box>
  );
}
