import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Package, AlertTriangle, ArrowRightLeft, History, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLowStock, setFilterLowStock] = useState(false);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.get('/products?per_page=100');
            setItems(res.data?.data ?? []);
        } catch (e) {
            setError('Unable to load inventory.');
        } finally {
            setIsLoading(false);
        }
    };

    const stats = {
        totalSKUs: items.length,
        lowStock: items.filter(i => i.stock > 0 && i.stock <= 5).length,
        outOfStock: items.filter(i => i.stock <= 0).length
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFilter = filterLowStock ? item.stock <= 5 : true;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Inventory</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Monitor stock levels, low stock alerts, and movements.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Transfer
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                        <History className="w-3.5 h-3.5" />
                        Stock take
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Total SKUs
                    </p>
                    <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalSKUs}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Low stock
                    </p>
                    <p className="mt-2 text-2xl font-bold text-amber-600">{stats.lowStock}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Out of stock
                    </p>
                    <p className="mt-2 text-2xl font-bold text-rose-600">{stats.outOfStock}</p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div className="flex-1 flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-indigo-500">
                        <Search className="w-4 h-4 text-zinc-400" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            placeholder="Search inventory..."
                        />
                    </div>
                    <div className="flex gap-2 text-xs">
                        <button 
                            onClick={() => setFilterLowStock(false)}
                            className={cn(
                                "inline-flex items-center rounded-full px-3 py-1 font-medium transition-colors",
                                !filterLowStock ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            )}
                        >
                            All Items
                        </button>
                        <button 
                            onClick={() => setFilterLowStock(true)}
                            className={cn(
                                "inline-flex items-center rounded-full px-3 py-1 font-medium transition-colors",
                                filterLowStock ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            )}
                        >
                            Low stock only
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">SKU</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">On Hand</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr>
                                        <td className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={4}>
                                            Loading inventory…
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={4}>
                                            <Package className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                            No products found in inventory.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.name}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 font-mono">{item.sku ?? '—'}</td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-zinc-900 dark:text-zinc-100">{item.stock}</td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                    item.stock <= 0 
                                                        ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" 
                                                        : item.stock <= 5 
                                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" 
                                                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                )}>
                                                    {item.stock <= 0 ? 'Out of Stock' : item.stock <= 5 ? 'Low Stock' : 'In Stock'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

