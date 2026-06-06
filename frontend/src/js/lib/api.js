import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

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
    const sanctumURL = import.meta.env.VITE_SANCTUM_URL || "";
    await axios.get(`${sanctumURL}/sanctum/csrf-cookie`, {
        withCredentials: true,
    });
}
