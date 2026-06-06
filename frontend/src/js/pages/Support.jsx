import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Plus, Search, MessageSquare, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Support() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        category: 'bug',
        priority: 'medium'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/tickets');
            setItems(res.data?.data ?? []);
        } catch (e) {
            setError('Failed to load support tickets.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/tickets', formData);
            setIsModalOpen(false);
            setFormData({ subject: '', description: '', category: 'bug', priority: 'medium' });
            loadTickets();
        } catch (e) {
            alert('Failed to submit ticket.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Help & Support</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Submit bugs, errors, or concerns to our administration team.
                    </p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Ticket
                </button>
            </div>

            <div className="grid gap-4">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center text-zinc-500">
                        <MessageSquare className="w-12 h-12 mx-auto opacity-10 mb-4" />
                        <p>No support tickets yet. Need help? Create a ticket above.</p>
                    </div>
                ) : (
                    items.map((ticket) => (
                        <div key={ticket.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                                        ticket.status === 'open' ? "bg-blue-100 text-blue-700" :
                                        ticket.status === 'resolved' ? "bg-emerald-100 text-emerald-700" :
                                        "bg-zinc-100 text-zinc-700"
                                    )}>
                                        {ticket.status}
                                    </span>
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{ticket.subject}</h3>
                                </div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{ticket.description}</p>
                                <div className="mt-3 flex items-center gap-4 text-[10px] text-zinc-400">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {ticket.category}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Create Support Ticket</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <Plus className="w-5 h-5 rotate-45" />
                            </button>
                        </header>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Subject</label>
                                    <input 
                                        required
                                        value={formData.subject}
                                        onChange={e => setFormData({...formData, subject: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        placeholder="Brief summary of the issue"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Category</label>
                                        <select 
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900"
                                        >
                                            <option value="bug">Bug Report</option>
                                            <option value="error">System Error</option>
                                            <option value="concern">General Concern</option>
                                            <option value="feature_request">Feature Request</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Priority</label>
                                        <select 
                                            value={formData.priority}
                                            onChange={e => setFormData({...formData, priority: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Description</label>
                                    <textarea 
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 h-32 resize-none" 
                                        placeholder="Please provide as much detail as possible..."
                                    />
                                </div>
                            </div>
                            <footer className="pt-4 flex justify-end gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
