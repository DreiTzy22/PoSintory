import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";
import { api, ensureCsrfCookie } from "../lib/api";
import { toast, alertError } from "../lib/swal";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        business_name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.password_confirmation) {
            setError("Passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            await ensureCsrfCookie();
            const response = await api.post("/register", formData);
            const { token: authToken, user } = response.data;
            
            localStorage.setItem("auth_token", authToken);
            localStorage.setItem("user_role", user.role);
            
            toast.fire({
                icon: 'success',
                title: 'Registration successful!',
                text: 'Welcome to PoSintory.'
            });

            navigate("/dashboard");
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed. Please check your details and try again.";
            setError(message);
            if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
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
                        Register your business to start managing your POS.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
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
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={cn(
                                "flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-zinc-100",
                            )}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Business Name
                        </label>
                        <input
                            type="text"
                            value={formData.business_name}
                            onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                            className={cn(
                                "flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-zinc-100",
                            )}
                            placeholder="My Awesome Store"
                            required
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={cn(
                                "flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-zinc-100",
                            )}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={cn(
                                    "flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-zinc-100",
                                )}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Confirm
                            </label>
                            <input
                                type="password"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                className={cn(
                                    "flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
                                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:text-zinc-100",
                                )}
                                placeholder="••••••••"
                                required
                            />
                        </div>
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
