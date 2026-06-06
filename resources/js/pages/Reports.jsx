import React from 'react';

export default function Reports() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Sales, inventory, tax, and performance reports.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {[
                    { title: 'Sales summary', desc: 'Totals by day, outlet, cashier, and payment method.' },
                    { title: 'Product performance', desc: 'Best sellers, slow movers, margins, and trends.' },
                    { title: 'Inventory valuation', desc: 'Stock value by category and outlet.' },
                    { title: 'Stock movements', desc: 'Adjustments, transfers, and stock takes.' },
                ].map((r) => (
                    <div key={r.title} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{r.title}</h2>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{r.desc}</p>
                        <div className="mt-4">
                            <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                Open report
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

