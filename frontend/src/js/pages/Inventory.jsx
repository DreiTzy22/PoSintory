import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { toast, alertError } from '../lib/swal';
import { Package, AlertTriangle, ArrowRightLeft, History, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterLowStock, setFilterLowStock] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [isStockTakeModalOpen, setIsStockTakeModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [adjustment, setAdjustment] = useState({ quantity: 0, reason: 'Correction' });

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.get('/products');
            setItems(res.data ?? []);
        } catch (e) {
            setError('Unable to load inventory.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdjustment = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;
        
        try {
            const newStock = selectedProduct.stock + parseInt(adjustment.quantity);
            await api.put(`/products/${selectedProduct.id}`, {
                ...selectedProduct,
                stock: newStock
            });
            setIsStockTakeModalOpen(false);
            setIsTransferModalOpen(false);
            setSelectedProduct(null);
            setAdjustment({ quantity: 0, reason: 'Correction' });
            loadInventory();
            toast.fire({ icon: 'success', title: 'Inventory updated!' });
        } catch (e) {
            alertError('Update Failed', 'Failed to update inventory. Please try again.');
        }
    };

    const stats = {
        totalSKUs: items.length,
        lowStock: items.filter(i => i.stock > 0 && i.stock <= 6).length,
        outOfStock: items.filter(i => i.stock <= 0).length
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFilter = filterLowStock ? item.stock <= 6 : true;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Inventory</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Monitor stock levels, low stock alerts, and movements.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsTransferModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Transfer
                    </button>
                    <button 
                        onClick={() => setIsStockTakeModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                    >
                        <History className="w-3.5 h-3.5" />
                        Stock take
                    </button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Total SKUs
                    </p>
                    <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalSKUs}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Low stock
                    </p>
                    <p className="mt-2 text-2xl font-bold text-amber-600">{stats.lowStock}</p>
                </div>
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        Out of stock
                    </p>
                    <p className="mt-2 text-2xl font-bold text-rose-600">{stats.outOfStock}</p>
                </div>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-col gap-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div className="flex-1 flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-indigo-500">
                        <Search className="w-4 h-4 text-zinc-400" />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                            placeholder="Search inventory..."
                        />
                    </div>
                    <div className="flex gap-2 text-xs">
                        <button 
                            onClick={() => setFilterLowStock(false)}
                            className={cn(
                                "inline-flex items-center rounded-full px-3 py-1 font-medium transition-colors",
                                !filterLowStock ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            )}
                        >
                            All Items
                        </button>
                        <button 
                            onClick={() => setFilterLowStock(true)}
                            className={cn(
                                "inline-flex items-center rounded-full px-3 py-1 font-medium transition-colors",
                                filterLowStock ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                            )}
                        >
                            Low stock only
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">SKU</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">On Hand</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr>
                                        <td className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={4}>
                                            Loading inventory…
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={4}>
                                            <Package className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                            No products found in inventory.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.name}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 font-mono">{item.sku ?? '—'}</td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-zinc-900 dark:text-zinc-100">{item.stock}</td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                                    item.stock <= 0 
                                                        ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400" 
                                                        : item.stock <= 6 
                                                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" 
                                                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                                )}>
                                                    {item.stock <= 0 ? 'Out of Stock' : item.stock <= 6 ? 'Low Stock' : 'In Stock'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Transfer / Adjustment Modal */}
            {(isTransferModalOpen || isStockTakeModalOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md overflow-hidden flex flex-col">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">{isTransferModalOpen ? 'Stock Transfer' : 'Stock Take / Adjustment'}</h3>
                            <button onClick={() => { setIsTransferModalOpen(false); setIsStockTakeModalOpen(false); setSelectedProduct(null); }} className="text-zinc-500 hover:text-zinc-700">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={handleAdjustment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Select Product</label>
                                <select 
                                    required
                                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={selectedProduct?.id || ''}
                                    onChange={(e) => setSelectedProduct(items.find(i => i.id === parseInt(e.target.value)))}
                                >
                                    <option value="">Select a product...</option>
                                    {items.map(i => (
                                        <option key={i.id} value={i.id}>{i.name} ({i.stock} on hand)</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                                    {isTransferModalOpen ? 'Quantity to Transfer' : 'Quantity Adjustment (+/-)'}
                                </label>
                                <input
                                    required
                                    type="number"
                                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={adjustment.quantity}
                                    onChange={(e) => setAdjustment({...adjustment, quantity: e.target.value})}
                                    placeholder="e.g. 10 or -5"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Reason / Notes</label>
                                <textarea
                                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                    value={adjustment.reason}
                                    onChange={(e) => setAdjustment({...adjustment, reason: e.target.value})}
                                    placeholder="Reason for adjustment..."
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                Confirm Adjustment
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function X(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}

