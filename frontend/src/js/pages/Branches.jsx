import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { toast, alertError, confirmAction } from '../lib/swal';
import { Plus, Search, Edit2, Trash2, X, MapPin, AlertCircle } from 'lucide-react';

export default function Branches() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        phone: '',
        address: '',
        is_active: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.get('/branches');
            setItems(res.data ?? []);
        } catch (e) {
            setError('Unable to load branches. Please login and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (branch = null) => {
        if (branch) {
            setEditingBranch(branch);
            setFormData({
                name: branch.name,
                location: branch.location || '',
                phone: branch.phone || '',
                address: branch.address || '',
                is_active: branch.is_active ?? true
            });
        } else {
            setEditingBranch(null);
            setFormData({
                name: '',
                location: '',
                phone: '',
                address: '',
                is_active: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingBranch) {
                await api.put(`/branches/${editingBranch.id}`, formData);
            } else {
                await api.post('/branches', formData);
            }
            setIsModalOpen(false);
            loadBranches();
            toast.fire({ icon: 'success', title: editingBranch ? 'Branch updated!' : 'Branch created!' });
        } catch (e) {
            alertError('Error', 'Failed to save branch. Please check your inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmAction('Delete Branch', 'Are you sure you want to delete this branch? This will not delete associated data, just the branch record.');
        if (!result.isConfirmed) return;
        
        try {
            await api.delete(`/branches/${id}`);
            loadBranches();
            toast.fire({ icon: 'success', title: 'Branch deleted!' });
        } catch (e) {
            alertError('Error', 'Failed to delete branch.');
        }
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Branches</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage your business branches and locations.
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add branch
                </button>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-indigo-500">
                        <Search className="w-4 h-4 text-zinc-400" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            placeholder="Search by name or location"
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Branch</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Location</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Phone</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr>
                                        <td className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={5}>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                Loading branches…
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={5}>
                                            <MapPin className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                            {searchQuery ? 'No branches match your search.' : 'No branches yet. Click “Add branch” to create your first location.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((b) => (
                                        <tr key={b.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                        <MapPin className="w-4 h-4" />
                                                    </div>
                                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{b.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">{b.location ?? '—'}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">{b.phone ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                                    b.is_active 
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' 
                                                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                                                }`}>
                                                    {b.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button 
                                                    onClick={() => handleOpenModal(b)}
                                                    className="p-1.5 rounded-md text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(b.id)}
                                                    className="p-1.5 rounded-md text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Branch Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Branch Name</label>
                                <input 
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                    placeholder="e.g. Main Store"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Location</label>
                                <input 
                                    value={formData.location}
                                    onChange={e => setFormData({...formData, location: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                    placeholder="e.g. Downtown"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Phone</label>
                                <input 
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                    placeholder="e.g. +1 555-123-4567"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Address</label>
                                <textarea 
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 min-h-[80px]" 
                                    placeholder="Full branch address"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={e => setFormData({...formData, is_active: e.target.checked})}
                                    className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="is_active" className="text-sm text-zinc-700 dark:text-zinc-300">Active</label>
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
                                    {isSubmitting ? 'Saving...' : 'Save Branch'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
