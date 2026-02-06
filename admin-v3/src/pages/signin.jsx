import React from "react";
import { useNavigate } from "react-router";
import { GoogleLogin } from "@react-oauth/google";
import { Box, Container, Paper, Typography } from "@mui/material";
import { useAuth } from "../AuthContext";

const SignIn = () => {
    const { handleLoginSuccess, loading } = useAuth();
    const navigate = useNavigate();

    const handleSuccess = (response) => {
        handleLoginSuccess(response);
        // Navigate to home after successful login
        setTimeout(() => navigate("/"), 500);
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
                    <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: "center" }}>
                        Sign In
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => console.error("Login Failed")}
                            disabled={loading}
                        />
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default SignIn;
