import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Plus, Search, Edit2, Trash2, X, ShoppingBag, AlertCircle, Calendar, Truck, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Purchasing() {
    const [items, setItems] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPO, setEditingPO] = useState(null);
    const [formData, setFormData] = useState({
        supplier_id: '',
        total_amount: '',
        order_date: new Date().toISOString().split('T')[0],
        expected_date: '',
        status: 'pending',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadPOs();
        loadSuppliers();
    }, []);

    const loadPOs = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.get('/purchase-orders');
            setItems(res.data ?? []);
        } catch (e) {
            setError('Unable to load purchase orders.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadSuppliers = async () => {
        try {
            const res = await api.get('/suppliers');
            setSuppliers(res.data ?? []);
        } catch (e) {
            console.error('Failed to load suppliers');
        }
    };

    const handleOpenModal = (po = null) => {
        if (po) {
            setEditingPO(po);
            setFormData({
                supplier_id: po.supplier_id,
                total_amount: po.total_amount,
                order_date: po.order_date,
                expected_date: po.expected_date || '',
                status: po.status,
                notes: po.notes || ''
            });
        } else {
            setEditingPO(null);
            setFormData({
                supplier_id: '',
                total_amount: '',
                order_date: new Date().toISOString().split('T')[0],
                expected_date: '',
                status: 'pending',
                notes: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingPO) {
                await api.put(`/purchase-orders/${editingPO.id}`, formData);
            } else {
                await api.post('/purchase-orders', formData);
            }
            setIsModalOpen(false);
            loadPOs();
        } catch (e) {
            alert('Failed to save purchase order.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this purchase order?')) return;
        try {
            await api.delete(`/purchase-orders/${id}`);
            loadPOs();
        } catch (e) {
            alert('Failed to delete purchase order.');
        }
    };

    const filteredItems = items.filter(item => 
        item.supplier?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toString().includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Purchasing</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage purchase orders, supplier shipments, and procurement.
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Purchase Order
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
                            placeholder="Search by ID or supplier"
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Order ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Supplier</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr>
                                        <td className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={6}>
                                            Loading purchase orders…
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={6}>
                                            <ShoppingBag className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                            No purchase orders found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((po) => (
                                        <tr key={po.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">PO-{po.id}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 font-semibold">{po.supplier?.name}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                                                {new Date(po.order_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-medium text-zinc-900 dark:text-zinc-100">
                                                ₱{parseFloat(po.total_amount).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                    po.status === 'received' 
                                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" 
                                                        : po.status === 'pending'
                                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" 
                                                            : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                                                )}>
                                                    {po.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right space-x-2">
                                                <button 
                                                    onClick={() => handleOpenModal(po)}
                                                    className="p-1.5 rounded-md text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(po.id)}
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

            {/* PO Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                {editingPO ? 'Edit Purchase Order' : 'New Purchase Order'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Supplier</label>
                                    <select 
                                        required
                                        value={formData.supplier_id}
                                        onChange={e => setFormData({...formData, supplier_id: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900"
                                    >
                                        <option value="">Select a supplier</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Total Amount (₱)</label>
                                        <input 
                                            required
                                            type="number"
                                            step="0.01"
                                            value={formData.total_amount}
                                            onChange={e => setFormData({...formData, total_amount: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Status</label>
                                        <select 
                                            value={formData.status}
                                            onChange={e => setFormData({...formData, status: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="received">Received</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Order Date
                                        </label>
                                        <input 
                                            required
                                            type="date"
                                            value={formData.order_date}
                                            onChange={e => setFormData({...formData, order_date: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase flex items-center gap-1">
                                            <Truck className="w-3 h-3" /> Expected Date
                                        </label>
                                        <input 
                                            type="date"
                                            value={formData.expected_date}
                                            onChange={e => setFormData({...formData, expected_date: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900" 
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Internal Notes</label>
                                    <textarea 
                                        value={formData.notes}
                                        onChange={e => setFormData({...formData, notes: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 h-20 resize-none" 
                                        placeholder="Add any internal details about this order..."
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
                                    {isSubmitting ? 'Saving...' : 'Save PO'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

