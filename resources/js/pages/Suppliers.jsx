import React from 'react';

export default function Suppliers() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage suppliers, contacts, and purchasing activity.
                    </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    Add supplier
                </button>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Supplier list and supplier detail pages will be wired once supplier endpoints exist.
                </div>
            </div>
        </div>
    );
}

