import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Sales() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function load() {
            setIsLoading(true);
            setError('');
            try {
                const res = await api.get('/api/sales');
                if (!isMounted) return;
                setItems(res.data?.data ?? []);
            } catch (e) {
                if (!isMounted) return;
                setError('Unable to load sales. Please login and try again.');
            } finally {
                if (!isMounted) return;
                setIsLoading(false);
            }
        }

        load();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        View receipts, payments, and issue refunds.
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div className="flex-1 flex rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm">
                        <input
                            className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            placeholder="Search receipt #, customer, cashier"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Date range
                        </button>
                        <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Export
                        </button>
                    </div>
                </div>

                <div className="mt-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {error ? (
                        <span className="text-rose-700 dark:text-rose-200">{error}</span>
                    ) : isLoading ? (
                        'Loading…'
                    ) : items.length === 0 ? (
                        'No sales yet.'
                    ) : (
                        <span>
                            Loaded <span className="font-semibold">{items.length}</span> sale(s). (Next: render table + detail drawer.)
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

