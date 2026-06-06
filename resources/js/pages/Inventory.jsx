import React from 'react';

export default function Inventory() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Monitor stock levels, low stock alerts, and movements.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        Adjust stock
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                        Transfer stock
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700">
                        New stock take
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Total SKUs
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">0</p>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Low stock
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">0</p>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Out of stock
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">0</p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Stock overview</h2>
                    <div className="flex gap-2 text-xs">
                        <button className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            All outlets
                        </button>
                        <button className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Low stock only
                        </button>
                    </div>
                </div>
                <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Inventory table will display products, stock per outlet, and status once connected to data.
                </div>
            </div>
        </div>
    );
}

