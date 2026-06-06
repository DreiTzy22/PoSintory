import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { cn } from "../lib/utils";
import { api, ensureCsrfCookie } from "../lib/api";

export default function Login() {
    const [token, setToken] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // In a real scenario, these come from your .env
    const siteKey = "1x00000000000000000000AA"; // Cloudflare's dummy sitekey for testing

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            alert("Please complete the human verification.");
            return;
        }

        setIsSubmitting(true);
        try {
            await ensureCsrfCookie();
            const response = await api.post("/login", { email, password });
            const { token: authToken, user } = response.data;
            
            localStorage.setItem("auth_token", authToken);
            localStorage.setItem("user_role", user.role);
            
            // Explicitly handle redirection based on role
            if (user.role === 'super_admin') {
                window.location.href = "/admin/tenants"; // System Admins go to management
            } else {
                window.location.href = "/dashboard"; // Tenants go to their dashboard
            }
        } catch (err) {
            setError(
                "Login failed. Please check your credentials and try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Workspace Login
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                        Enter your credentials to access your dashboard.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    {error ? (
                        <div className="rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
                            {error}
                        </div>
                    ) : null}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cn(
                                "flex h-11 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-zinc-100",
                            )}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                                "flex h-11 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-zinc-100",
                            )}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="flex justify-center pt-2">
                        <Turnstile
                            siteKey={siteKey}
                            onSuccess={(token) => setToken(token)}
                            options={{ theme: "auto" }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                            "w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-11",
                            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                            isSubmitting &&
                                "opacity-70 cursor-not-allowed hover:bg-indigo-600",
                        )}
                    >
                        {isSubmitting ? "Signing in…" : "Sign In"}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">
                            Need an account?{" "}
                        </span>
                        <Link
                            to="/register"
                            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Register your business
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
