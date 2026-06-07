import axios from "axios";

const rawBaseURL =
    import.meta.env.VITE_API_URL ||
    "https://posintory-production-fec7.up.railway.app/api";

const baseURL = rawBaseURL.endsWith("/")
    ? rawBaseURL.slice(0, -1)
    : rawBaseURL;

export const api = axios.create({
    baseURL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Attach Bearer token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export async function ensureCsrfCookie() {
    return Promise.resolve();
}