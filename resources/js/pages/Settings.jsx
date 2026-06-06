import React from 'react';

export default function Settings() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Business profile, tax, outlets, registers, and integrations.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {[
                    { title: 'Business profile', desc: 'Company name, logo, receipt footer, timezone, currency.' },
                    { title: 'Tax & pricing', desc: 'Tax rates, inclusive/exclusive, rounding rules.' },
                    { title: 'Outlets & registers', desc: 'Manage outlets, registers, printers, and cash drawers.' },
                    { title: 'Integrations', desc: 'Payment gateways, accounting, e-commerce (future).' },
                ].map((s) => (
                    <div key={s.title} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.title}</h2>
                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{s.desc}</p>
                        <div className="mt-4">
                            <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                Open
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

