import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router";
import App from "./App";
import Layout from "./layouts/dashboard";
import Admin from "./pages/admin";
import Events from "./pages/events";
import SignIn from "./pages/signin";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./AuthContext";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Protected Route Wrapper - must be inside router
const ProtectedRouteLayout = () => {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};

const router = createBrowserRouter([
    {
        Component: App,
        children: [
            {
                path: "/signin",
                Component: SignIn,
            },
            {
                path: "/",
                Component: ProtectedRouteLayout,
                children: [
                    {
                        path: "admin",
                        Component: Admin,
                    },
                    {
                        path: "events",
                        Component: Events,
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <React.StrictMode>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </React.StrictMode>
    </GoogleOAuthProvider>,
);
