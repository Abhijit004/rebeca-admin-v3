import React, { createContext, useContext, useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import { googleLogout } from "@react-oauth/google";
import { checkAuthStatus, logoutAdmin, loginWithGoogle } from "./utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            try {
                // This request automatically sends the 'jwt' cookie if it exists
                const res = await checkAuthStatus();
                console.log(res);

                if (res.data.status === "success") {
                    setUser(res.data.data.user);
                }
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const handleLoginSuccess = async (response) => {
        setLoading(true);
        try {
            const res = await loginWithGoogle(response.credential);
            setUser(res.data.data.user);
            showAlert("Login successful!", "success");
        } catch (err) {
            console.error("Login Failed on Backend:", err.response?.data || err.message);
            showAlert("Login failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            // 1. Tell backend to expire the JWT cookie
            await logoutAdmin();

            // 2. Tell Google library to clear its session
            googleLogout();

            // 3. Clear local React state
            setUser(null);
            localStorage.removeItem("session");
            showAlert("Logged out successfully", "success");
        } catch (err) {
            console.error("Logout failed:", err);
            showAlert("Logout failed", "error");
        }
    };

    const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });
    const showAlert = (message, severity = "info") => {
        setAlert({ open: true, message, severity });
    };
    const handleClose = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <AuthContext.Provider value={{ user, handleLoginSuccess, handleLogout, loading, showAlert }}>
            {children}

            {/* MUI Snackbar for notifications */}
            <Snackbar
                open={alert.open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleClose} severity={alert.severity} variant="filled">
                    {alert.message}
                </Alert>
            </Snackbar>
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
