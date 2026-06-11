import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { LayoutDashboard, Tag, Package, AlertTriangle, Users, Building2, MessageSquare, Activity, ShoppingCart, BarChart3, ArrowRight, Filter } from 'lucide-react';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
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

                const params = selectedBranchId ? { branch_id: selectedBranchId } : {};
                const statsRes = await api.get('/stats', { params });
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
    }, [selectedBranchId]);

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                
                {!isSuperAdmin && stats?.branches && stats.branches.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-zinc-500" />
                        <select
                            value={selectedBranchId || ''}
                            onChange={(e) => setSelectedBranchId(e.target.value ? parseInt(e.target.value) : null)}
                            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-zinc-900 dark:text-zinc-100"
                        >
                            <option value="">All Branches</option>
                            {stats.branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
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
                <>
                    <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-teal-100 dark:border-teal-800/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Today&apos;s Sales</p>
                                <ShoppingCart className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                            </div>
                            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">₱{parseFloat(stats?.today_sales || 0).toFixed(2)}</p>
                            <p className="mt-1 text-xs text-teal-500 dark:text-teal-400 flex items-center gap-1">
                                <ArrowRight className="w-3 h-3 rotate-[-45deg]" /> Gross revenue for today
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Total Products</p>
                                <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.total_products || 0}</p>
                            <p className="mt-1 text-xs text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                                <ArrowRight className="w-3 h-3 rotate-[-45deg]" /> Unique items in catalog
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-100 dark:border-violet-800/30 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Low Stock Items</p>
                                <AlertTriangle className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                            </div>
                            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.low_stock_count || 0}</p>
                            <p className="mt-1 text-xs text-violet-500 dark:text-violet-400 flex items-center gap-1">
                                <ArrowRight className="w-3 h-3 rotate-[-45deg]" /> Items needing replenishment
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Sales Trend</h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Last 7 days of sales performance</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-teal-500" />
                                <span className="text-xs text-zinc-500">Daily Sales</span>
                            </div>
                        </div>
                        <div className="flex items-end gap-2 h-48">
                            {(stats?.sales_trend || [0, 0, 0, 0, 0, 0, 0]).map((sales, i) => {
                                // Calculate height percentage relative to max sales in the trend
                                const allSales = stats?.sales_trend || [0];
                                const maxSales = Math.max(...allSales, 1); // Prevent division by zero
                                const heightPercent = Math.max(5, (sales / maxSales) * 100); // Min 5% height
                                return (
                                    <div 
                                        key={i} 
                                        className="flex-1 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-t-lg transition-all duration-300 hover:from-teal-600 hover:to-cyan-500 flex flex-col items-center justify-end pb-2"
                                        style={{ height: `${heightPercent}%` }}
                                        title={`${stats?.sales_trend_labels?.[i] || ''}: ₱${parseFloat(sales).toFixed(2)}`}
                                    >
                                        {sales > 0 && (
                                            <span className="text-[10px] text-white font-semibold">
                                                ₱{parseFloat(sales).toFixed(0)}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Day labels */}
                        <div className="flex justify-between mt-2 text-xs text-zinc-500">
                            {(stats?.sales_trend_labels || ['', '', '', '', '', '', '']).map((label, i) => (
                                <span key={i} className="flex-1 text-center">{label}</span>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

