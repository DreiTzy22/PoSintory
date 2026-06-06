import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="mx-auto max-w-lg text-center py-16">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Page not found</h1>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                The page you&apos;re looking for doesn&apos;t exist or was moved.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                    Go to dashboard
                </Link>
                <Link
                    to="/pos"
                    className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                    Open POS
                </Link>
            </div>
        </div>
    );
}

