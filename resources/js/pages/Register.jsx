import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import { cn } from "../lib/utils";
import { api, ensureCsrfCookie } from "../lib/api";

export default function Register() {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const siteKey = "1x00000000000000000000AA"; // Cloudflare's dummy sitekey for testing

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setValidationErrors({});

        // Client-side validation
        const errors = {};
        if (!name.trim()) errors.name = "Name is required";
        if (!email.trim()) errors.email = "Email is required";
        if (password.length < 8)
            errors.password = "Password must be at least 8 characters";
        if (password !== passwordConfirmation)
            errors.passwordConfirmation = "Passwords do not match";
        if (!token) errors.turnstile = "Please complete the human verification";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setIsSubmitting(true);
        try {
            await ensureCsrfCookie();
            const response = await api.post("/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            // Auto-login after successful registration
            localStorage.setItem("auth_token", response.data.token);
            navigate("/dashboard");
        } catch (err) {
            if (err.response?.data?.errors) {
                setValidationErrors(err.response.data.errors);
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-6">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Create Account
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                        Sign up for your POS and Inventory System
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    {error ? (
                        <div className="rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
                            {error}
                        </div>
                    ) : null}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                                "flex h-11 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-zinc-100",
                                validationErrors.name &&
                                    "border-rose-500 focus-visible:ring-rose-500",
                            )}
                            placeholder="John Doe"
                            required
                        />
                        {validationErrors.name && (
                            <p className="text-xs text-rose-600 dark:text-rose-400">
                                {validationErrors.name}
                            </p>
                        )}
                    </div>

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
                                validationErrors.email &&
                                    "border-rose-500 focus-visible:ring-rose-500",
                            )}
                            placeholder="user@example.com"
                            required
                        />
                        {validationErrors.email && (
                            <p className="text-xs text-rose-600 dark:text-rose-400">
                                {validationErrors.email}
                            </p>
                        )}
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
                                validationErrors.password &&
                                    "border-rose-500 focus-visible:ring-rose-500",
                            )}
                            placeholder="••••••••"
                            required
                        />
                        {validationErrors.password && (
                            <p className="text-xs text-rose-600 dark:text-rose-400">
                                {validationErrors.password}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                            className={cn(
                                "flex h-11 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-zinc-100",
                                validationErrors.passwordConfirmation &&
                                    "border-rose-500 focus-visible:ring-rose-500",
                            )}
                            placeholder="••••••••"
                            required
                        />
                        {validationErrors.passwordConfirmation && (
                            <p className="text-xs text-rose-600 dark:text-rose-400">
                                {validationErrors.passwordConfirmation}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-center pt-2">
                        <Turnstile
                            siteKey={siteKey}
                            onSuccess={(token) => setToken(token)}
                            options={{ theme: "auto" }}
                        />
                    </div>
                    {validationErrors.turnstile && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 text-center">
                            {validationErrors.turnstile}
                        </p>
                    )}

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
                        {isSubmitting ? "Creating Account…" : "Create Account"}
                    </button>

                    <div className="text-center text-sm">
                        <span className="text-zinc-600 dark:text-zinc-400">
                            Already have an account?{" "}
                        </span>
                        <Link
                            to="/login"
                            className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
