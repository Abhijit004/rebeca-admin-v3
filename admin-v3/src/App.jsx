import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import { Outlet, useNavigate, Navigate, useLocation } from "react-router";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { useAuth } from "./AuthContext";
import { Box, CircularProgress } from "@mui/material";
import { useMemo } from "react";
import "./App.css";

const NAVIGATION = [
    {
        kind: "header",
        title: "Navigation",
    },
    {
        segment: "admin",
        title: "Admin",
        icon: <DashboardIcon />,
    },
    {
        segment: "events",
        title: "Events",
        icon: <SettingsIcon />,
    },
];

const BRANDING = {
    title: "Admin V3",
};

export default function App() {
    const { handleLogout, user, loading } = useAuth();

    // Derived session - this is the key fix
    const session = useMemo(() => (user ? {
        user: {
            name: user.name,
            email: user.email,
            image: user.image,
        }
    } : null), [user]);
    
    const handleLogoutClick = async () => {
        await handleLogout();
        navigate("/signin");
    };

    const authentication = useMemo(() => {
        return {
            signIn: () => {},
            signOut: () => {
                handleLogoutClick();
            },
        };
    }, []);

    const navigate = useNavigate();
    const location = useLocation();

    // Show loading screen while checking auth
    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    // If not signed in and not on signin page, redirect
    if (!user && location.pathname !== "/signin") {
        return <Navigate to="/signin" replace />;
    }

    // If signed in but on signin page, redirect to home
    if (user && location.pathname === "/signin") {
        return <Navigate to="/" replace />;
    }

    // If on signin page, just show Outlet (no Toolpad layout)
    if (location.pathname === "/signin") {
        return <Outlet />;
    }

    return (user &&
        <ReactRouterAppProvider
            navigation={NAVIGATION}
            branding={BRANDING}
            session={session}
            authentication={authentication}
        >
            <Outlet />
        </ReactRouterAppProvider>
    );
}
