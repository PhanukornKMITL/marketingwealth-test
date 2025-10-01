import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

import AuthForm from "../components/AuthForm";

import { login } from "../api/authApi";

import { toast } from "react-toastify";

function LoginPage() {

    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        try {
            const res = await login(data.username, data.password);

            localStorage.setItem("token", res.token);

            console.log('test');
            


            navigate("/");
        } catch (error) {
            toast.error(error.message || "Login failed");
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
                <AuthForm mode="login" onSubmit={handleSubmit} />

                <div style={{ textAlign: "center" }}>
                    <span>Don't have an account? </span>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
