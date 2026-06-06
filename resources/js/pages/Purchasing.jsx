import React from 'react';

export default function Purchasing() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Purchasing</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Create purchase orders, receive goods, and track supplier orders.
                    </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    New purchase order
                </button>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div className="flex-1 flex rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm">
                        <input
                            className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            placeholder="Search PO #, supplier, status"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Status
                        </button>
                        <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Outlet
                        </button>
                    </div>
                </div>

                <div className="mt-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Backend endpoints for purchase orders aren&apos;t in `routes/api.php` yet. Once added, this page can be wired like Products.
                </div>
            </div>
        </div>
    );
}

