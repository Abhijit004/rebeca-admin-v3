import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// auth apis
export const checkAuthStatus = () => API.get("/auth/checkStatus")
export const logoutAdmin = () => API.get("/auth/logout");
export const loginWithGoogle = (idToken) =>
    API.post("/auth/google-login", {
        credential: idToken,
    });

// admin apis
export const updateAdmin = (data) =>
    API.patch("/admin", data, {
        headers: {
            "Content-Type": "application/json",
        },
    });

export default API;
