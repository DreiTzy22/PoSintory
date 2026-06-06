import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Dashboard() {
    const [isAuthed, setIsAuthed] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function loadMe() {
            try {
                await api.get('/api/user');
                if (!isMounted) return;
                setIsAuthed(true);
            } catch (e) {
                if (!isMounted) return;
                setIsAuthed(false);
            }
        }
        loadMe();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        High-level view of today&apos;s sales and inventory health.
                    </p>
                </div>
            </div>

            {!isAuthed ? (
                <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
                    You are not logged in yet. Go to <a className="font-semibold underline" href="/login">Login</a> to access POS and API-backed pages.
                </div>
            ) : null}

            <div className="grid gap-4 md:gap-6 md:grid-cols-4">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Today&apos;s Sales
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        ₱0.00
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        No data yet. Start selling to see insights.
                    </p>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Top Product
                    </p>
                    <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        ——
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Your best-selling products will appear here.
                    </p>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Low Stock
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        0
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Keep an eye on items that need replenishment.
                    </p>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Customers
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                        0
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Add customers as you make sales to build loyalty.
                    </p>
                </div>
            </div>
        </div>
    );
}

