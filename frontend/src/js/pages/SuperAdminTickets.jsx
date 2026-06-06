import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { MessageSquare, Search, CheckCircle2, Clock, AlertCircle, Building2, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SuperAdminTickets() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/tickets');
            setItems(res.data?.data ?? []);
        } catch (e) {
            console.error('Failed to load tickets');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/tickets/${id}`, { status });
            loadTickets();
        } catch (e) {
            alert('Failed to update ticket status');
        }
    };

    const filteredItems = items.filter(i => 
        i.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.tenant?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Support Tickets</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Respond to tenant concerns, bug reports, and feature requests.
                    </p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-indigo-500">
                    <Search className="w-4 h-4 text-zinc-400" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                        placeholder="Search tickets or tenants..."
                    />
                </div>

                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-12 text-zinc-500">No tickets found.</div>
                    ) : (
                        filteredItems.map((ticket) => (
                            <div key={ticket.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                            ticket.priority === 'urgent' ? "bg-rose-100 text-rose-700" :
                                            ticket.priority === 'high' ? "bg-amber-100 text-amber-700" :
                                            "bg-blue-100 text-blue-700"
                                        )}>
                                            {ticket.priority}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                            ticket.status === 'resolved' ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-700"
                                        )}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">{ticket.subject}</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{ticket.description}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                                        <div className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                                            <Building2 className="w-3.5 h-3.5" />
                                            {ticket.tenant?.name}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            {ticket.user?.name}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    {ticket.status !== 'resolved' && (
                                        <button 
                                            onClick={() => updateStatus(ticket.id, 'resolved')}
                                            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                                        >
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Resolve
                                        </button>
                                    )}
                                    {ticket.status === 'open' && (
                                        <button 
                                            onClick={() => updateStatus(ticket.id, 'in_progress')}
                                            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 transition-colors"
                                        >
                                            Start working
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
