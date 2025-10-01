import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import AuthForm from "../components/AuthForm";

import { register } from "../api/authApi";

import { toast } from "react-toastify";

function RegisterPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      
      const res = await register(data.username, data.password, data.confirmPassword);

      localStorage.setItem("token", res.token);

      navigate("/");
    } catch (error) {
      toast.error(error.message || "Register failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <h1>Order Management System</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <AuthForm mode="register" onSubmit={handleSubmit} />

        <div style={{ textAlign: "center" }}>
          <span>Already have an account? </span>
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
