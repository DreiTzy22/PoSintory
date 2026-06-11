import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { LayoutDashboard, Tag, Package, AlertTriangle, Users, Building2, MessageSquare, Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { api } from '../lib/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function SuperAdminDashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function loadData() {
            try {
                const userRes = await api.get('/user');
                if (!isMounted) return;
                setUser(userRes.data);

                const statsRes = await api.get('/stats');
                if (!isMounted) return;
                setStats(statsRes.data);

                const analyticsRes = await api.get('/admin/analytics');
                if (!isMounted) return;
                setAnalytics(analyticsRes.data);
            } catch (e) {
                console.error('Failed to load dashboard data', e);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }
        loadData();
        return () => { isMounted = false; };
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Super Admin Console
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Global system overview, analytics, and tenant performance reports.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
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

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Sales Over Time */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Sales Trend Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics?.sales_trend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                            <XAxis dataKey="name" stroke="#71717a" />
                            <YAxis stroke="#71717a" />
                            <Tooltip formatter={(value) => [`₱${parseFloat(value).toFixed(2)}`, 'Sales']} />
                            <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} fill="#eef2ff" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Tenant Performance */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Top Tenant Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics?.top_tenants}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                            <XAxis dataKey="name" stroke="#71717a" />
                            <YAxis stroke="#71717a" />
                            <Tooltip formatter={(value) => [`₱${parseFloat(value).toFixed(2)}`, 'Revenue']} />
                            <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Distribution and Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Product Categories */}
                <div className="lg:col-span-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Product Category Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analytics?.category_distribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {analytics?.category_distribution?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                        <button onClick={() => window.location.href = '/admin/tenants'} className="w-full text-left p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Manage Tenants</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">View and edit business accounts</p>
                        </button>
                        <button onClick={() => window.location.href = '/admin/health'} className="w-full text-left p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">System Health</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Monitor server and database status</p>
                        </button>
                        <button onClick={() => window.location.href = '/admin/tickets'} className="w-full text-left p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Support Tickets</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Respond to user issues</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Recent System Activity</h3>
                <div className="space-y-4">
                    {analytics?.recent_activity?.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                            <div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{activity.message}</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{activity.type}</p>
                            </div>
                            <span className="text-xs text-zinc-400">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
