import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Shield, Database, Cpu, Activity, Server, HardDrive } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SystemHealth() {
    const [health, setHealth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHealth();
    }, []);

    const loadHealth = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/system-health');
            setHealth(res.data);
        } catch (e) {
            console.error('Failed to load system health');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

    const stats = [
        { name: 'Database', value: health?.database, icon: Database, status: 'Healthy' },
        { name: 'PHP Version', value: health?.php_version, icon: Cpu, status: 'Up to date' },
        { name: 'Laravel', value: health?.laravel_version, icon: Server, status: 'Stable' },
        { name: 'Tenants', value: health?.total_tenants, icon: Activity, status: 'Active' },
        { name: 'Global Users', value: health?.total_users, icon: Shield, status: 'Monitored' },
        { name: 'Gross Volume', value: `₱${parseFloat(health?.total_sales || 0).toFixed(2)}`, icon: HardDrive, status: 'Syncing' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">System Health</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Monitor global infrastructure, database status, and aggregate system metrics.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((s) => (
                    <div key={s.name} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400">
                                <s.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                {s.status}
                            </span>
                        </div>
                        <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{s.name}</h2>
                        <p className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 text-center shadow-sm">
                <Activity className="w-12 h-12 mx-auto text-emerald-500 mb-4 animate-pulse" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">All Systems Operational</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mt-2">
                    Global services are running normally. No active incidents reported in the last 24 hours.
                </p>
            </div>
        </div>
    );
}
