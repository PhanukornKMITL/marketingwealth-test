import React, { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { toast } from "react-toastify";

function AuthForm({ mode = "login", initialData = {}, onSubmit }) {
  const [username, setUsername] = useState(initialData.username || "");
  const [password, setPassword] = useState(initialData.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "register" && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    onSubmit({ username, password, confirmPassword });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", width: 400, gap: 16 }}
    >
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {mode === "register" && (
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      )}

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
        >
          {mode === "login" ? "Login" : "Register"}
        </Button>
      </Box>
    </form>
  );
}

export default AuthForm;
