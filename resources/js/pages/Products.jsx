import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Products() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function load() {
            setIsLoading(true);
            setError('');
            try {
                const res = await api.get('/api/products');
                if (!isMounted) return;
                setItems(res.data?.data ?? []);
            } catch (e) {
                if (!isMounted) return;
                setError('Unable to load products. Please login and try again.');
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
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage your product catalog, pricing, and variants.
                    </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    Add product
                </button>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 flex rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm">
                        <input
                            className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            placeholder="Search by name, SKU, or barcode"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <button className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            All
                        </button>
                        <button className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            In stock
                        </button>
                        <button className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Low stock
                        </button>
                        <button className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Inactive
                        </button>
                    </div>
                </div>

                {error ? (
                    <div className="rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-200">
                        {error}
                    </div>
                ) : null}

                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                        <thead className="bg-zinc-50 dark:bg-zinc-950/40">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300">SKU</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300">Price</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300">Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                            {isLoading ? (
                                <tr>
                                    <td className="px-4 py-4 text-sm text-zinc-500 dark:text-zinc-400" colSpan={4}>
                                        Loading…
                                    </td>
                                </tr>
                            ) : items.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={4}>
                                        No products yet. Click “Add product” to create your first item.
                                    </td>
                                </tr>
                            ) : (
                                items.map((p) => (
                                    <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/40">
                                        <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.name}</td>
                                        <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">{p.sku ?? '—'}</td>
                                        <td className="px-4 py-3 text-sm text-right text-zinc-900 dark:text-zinc-100">
                                            {typeof p.price === 'number' ? p.price.toFixed(2) : p.price}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right text-zinc-900 dark:text-zinc-100">
                                            {p.stock ?? 0}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

