import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { toast, alertError, confirmAction } from '../lib/swal';
import { Plus, Search, Edit2, Trash2, X, Factory, AlertCircle, Phone, Mail, MapPin, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Suppliers() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.get('/suppliers');
            setItems(res.data ?? []);
        } catch (e) {
            setError('Unable to load suppliers. Please login and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (supplier = null) => {
        if (supplier) {
            setEditingSupplier(supplier);
            setFormData({
                name: supplier.name,
                contact_person: supplier.contact_person || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || ''
            });
        } else {
            setEditingSupplier(null);
            setFormData({
                name: '',
                contact_person: '',
                email: '',
                phone: '',
                address: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingSupplier) {
                await api.put(`/suppliers/${editingSupplier.id}`, formData);
            } else {
                await api.post('/suppliers', formData);
            }
            setIsModalOpen(false);
            loadSuppliers();
            toast.fire({ icon: 'success', title: editingSupplier ? 'Supplier updated!' : 'Supplier created!' });
        } catch (e) {
            alertError('Error', 'Failed to save supplier. Please check your inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmAction('Delete Supplier', 'Are you sure you want to delete this supplier?');
        if (!result.isConfirmed) return;
        
        try {
            await api.delete(`/suppliers/${id}`);
            loadSuppliers();
            toast.fire({ icon: 'success', title: 'Supplier deleted!' });
        } catch (e) {
            alertError('Error', 'Failed to delete supplier.');
        }
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.contact_person && item.contact_person.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Suppliers</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage supplier profiles, contacts, and purchasing sources.
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Supplier
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
                            placeholder="Search by name, contact, or email"
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Supplier</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Contact Person</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Info</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr>
                                        <td className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={4}>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                Loading suppliers…
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={4}>
                                            <Factory className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                            {searchQuery ? 'No suppliers match your search.' : 'No suppliers yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((s) => (
                                        <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                                        <Factory className="w-4 h-4" />
                                                    </div>
                                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{s.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                                                <div className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5" />
                                                    {s.contact_person || '—'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="space-y-1">
                                                    {s.email && (
                                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                                            <Mail className="w-3 h-3" />
                                                            {s.email}
                                                        </div>
                                                    )}
                                                    {s.phone && (
                                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                                                            <Phone className="w-3 h-3" />
                                                            {s.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button 
                                                    onClick={() => handleOpenModal(s)}
                                                    className="p-1.5 rounded-md text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(s.id)}
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

            {/* Supplier Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Supplier Name</label>
                                    <input 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Contact Person</label>
                                    <input 
                                        value={formData.contact_person}
                                        onChange={e => setFormData({...formData, contact_person: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        placeholder="Name of contact person"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Email Address</label>
                                        <input 
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                            placeholder="supplier@example.com"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Phone Number</label>
                                        <input 
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                            placeholder="09123456789"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Office Address</label>
                                    <textarea 
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 h-20 resize-none" 
                                        placeholder="Supplier office location"
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
                                    {isSubmitting ? 'Saving...' : 'Save Supplier'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

