import axios from "axios";

// Ensure baseURL doesn't have a trailing slash to prevent 405/301 issues
const rawBaseURL = import.meta.env.VITE_API_URL || "/api";
const baseURL = rawBaseURL.endsWith('/') ? rawBaseURL.slice(0, -1) : rawBaseURL;

export const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
    },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export async function ensureCsrfCookie() {
    const rawSanctumURL = import.meta.env.VITE_SANCTUM_URL || "";
    const sanctumURL = rawSanctumURL.endsWith('/') ? rawSanctumURL.slice(0, -1) : rawSanctumURL;
    
    await axios.get(`${sanctumURL}/sanctum/csrf-cookie`, {
        withCredentials: true,
    });
}
