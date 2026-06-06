import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { LayoutDashboard, Tag, Package, AlertTriangle, Users, Building2, MessageSquare, Activity } from 'lucide-react';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const storedRole = localStorage.getItem('user_role');

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            try {
                const userRes = await api.get('/user');
                if (!isMounted) return;
                setUser(userRes.data);
                
                // Refresh stored role if API returns it
                if (userRes.data.role) {
                    localStorage.setItem('user_role', userRes.data.role);
                }

                const statsRes = await api.get('/stats');
                if (!isMounted) return;
                setStats(statsRes.data);
            } catch (e) {
                console.error('Failed to load dashboard data');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadData();
        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const currentRole = user?.role || storedRole;
    const isSuperAdmin = currentRole === 'super_admin';

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {isSuperAdmin ? 'System Console' : 'Dashboard'}
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {isSuperAdmin 
                            ? 'Global overview of system performance and tenant activity.' 
                            : 'High-level view of today\'s sales and inventory health.'}
                    </p>
                </div>
            </div>

            {isSuperAdmin ? (
                <div className="grid gap-4 md:gap-6 md:grid-cols-4">
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Tenants</p>
                            <Building2 className="w-4 h-4 text-indigo-500" />
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.total_tenants || 0}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Registered businesses</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Global Users</p>
                            <Users className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.total_users || 0}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Total staff across all tenants</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Open Tickets</p>
                            <MessageSquare className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.open_tickets || 0}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Support requests needing attention</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Global Volume</p>
                            <Activity className="w-4 h-4 text-rose-500" />
                        </div>
                        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">₱{parseFloat(stats?.total_sales || 0).toFixed(2)}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Total processed revenue</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 md:gap-6 md:grid-cols-4">
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Today&apos;s Sales</p>
                            <Tag className="w-4 h-4 text-indigo-500" />
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">₱{parseFloat(stats?.today_sales || 0).toFixed(2)}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Gross revenue for today</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Top Product</p>
                            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{stats?.top_product}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Best seller by volume</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Low Stock</p>
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.low_stock_count || 0}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Items needing replenishment</p>
                    </div>

                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Items</p>
                            <Package className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.total_products || 0}</p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Unique products in catalog</p>
                    </div>
                </div>
            )}
        </div>
    );
}

