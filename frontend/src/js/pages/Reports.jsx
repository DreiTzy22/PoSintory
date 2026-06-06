import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { BarChart3, TrendingUp, Package, Wallet, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Reports() {
    const [stats, setStats] = useState({
        today_sales: 0,
        total_products: 0,
        low_stock_count: 0,
        top_product: 'None'
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/stats');
            setStats(res.data);
        } catch (e) {
            console.error('Failed to load stats');
        } finally {
            setIsLoading(false);
        }
    };

    const reportCards = [
        { title: 'Sales summary', desc: 'Overview of revenue and transactions.', icon: TrendingUp, color: 'text-emerald-500', value: `₱${parseFloat(stats.today_sales).toFixed(2)}` },
        { title: 'Product performance', desc: 'Best selling items in your catalog.', icon: Package, color: 'text-indigo-500', value: stats.top_product },
        { title: 'Inventory valuation', desc: 'Items currently in stock.', icon: Wallet, color: 'text-amber-500', value: stats.total_products },
        { title: 'Stock alerts', desc: 'Items that need replenishment.', icon: Calendar, color: 'text-rose-500', value: stats.low_stock_count },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Reports</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Analyze your business performance with real-time data.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {reportCards.map((r) => (
                    <div key={r.title} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800", r.color)}>
                                <r.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{r.title}</h2>
                            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{r.value}</p>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{r.desc}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                                View Details →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center shadow-sm">
                <BarChart3 className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Detailed Analytics</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-2">
                    Advanced charts and downloadable CSV reports are being generated based on your transaction history.
                </p>
            </div>
        </div>
    );
}

