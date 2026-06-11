import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { toast, alertError, confirmAction } from '../lib/swal';
import { Plus, Search, Edit2, Trash2, X, Package, AlertCircle, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Products() {
    const [items, setItems] = useState([]);
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        barcode: '',
        price: '',
        stock: '',
        description: '',
        status: 'active',
        branch_id: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadProducts();
        loadBranches();
    }, []);

    const loadProducts = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.get('/products');
            setItems(res.data ?? []);
        } catch (e) {
            setError('Unable to load products. Please login and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadBranches = async () => {
        try {
            const res = await api.get('/branches');
            setBranches(res.data ?? []);
        } catch (e) {
            console.error('Failed to load branches');
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                sku: product.sku || '',
                barcode: product.barcode || '',
                price: product.price,
                stock: product.stock,
                description: product.description || '',
                status: product.status || 'active',
                branch_id: product.branch_id || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                sku: '',
                barcode: '',
                price: '',
                stock: '',
                description: '',
                status: 'active',
                branch_id: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, formData);
            } else {
                await api.post('/products', formData);
            }
            setIsModalOpen(false);
            loadProducts();
            toast.fire({ icon: 'success', title: editingProduct ? 'Product updated!' : 'Product created!' });
        } catch (e) {
            alertError('Error', 'Failed to save product. Please check your inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmAction('Delete Product', 'Are you sure you want to delete this product?');
        if (!result.isConfirmed) return;
        
        try {
            await api.delete(`/products/${id}`);
            loadProducts();
            toast.fire({ icon: 'success', title: 'Product deleted!' });
        } catch (e) {
            alertError('Error', 'Failed to delete product.');
        }
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Products</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage your product catalog, pricing, and variants.
                    </p>
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add product
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
                            placeholder="Search by name, SKU, or barcode"
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
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Product</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">SKU</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Branch</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Stock</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr>
                                        <td className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={6}>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                Loading products…
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={6}>
                                            <Package className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                            {searchQuery ? 'No products match your search.' : 'No products yet. Click “Add product” to create your first item.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((p) => {
                                        const productBranch = branches.find(b => b.id === p.branch_id);
                                        return (
                                            <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                            <Package className="w-4 h-4" />
                                                        </div>
                                                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{p.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400 font-mono">{p.sku ?? '—'}</td>
                                                <td className="px-4 py-3">
                                                    {productBranch ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400">
                                                            <MapPin className="w-3 h-3" />
                                                            {productBranch.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-zinc-500">No Branch</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-right text-zinc-900 dark:text-zinc-100">₱{parseFloat(p.price).toFixed(2)}</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className={cn(
                                                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                                        p.stock <= 5 ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400" : "text-zinc-900 dark:text-zinc-100"
                                                    )}>
                                                        {p.stock ?? 0}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <button 
                                                        onClick={() => handleOpenModal(p)}
                                                        className="p-1.5 rounded-md text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(p.id)}
                                                        className="p-1.5 rounded-md text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Product Name</label>
                                    <input 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        placeholder="e.g. Arabica Coffee Beans"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Branch</label>
                                    <select 
                                        value={formData.branch_id}
                                        onChange={e => setFormData({...formData, branch_id: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900"
                                    >
                                        <option value="">No Branch</option>
                                        {branches.map(b => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">SKU</label>
                                    <input 
                                        value={formData.sku}
                                        onChange={e => setFormData({...formData, sku: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Barcode</label>
                                    <input 
                                        value={formData.barcode}
                                        onChange={e => setFormData({...formData, barcode: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Price (₱)</label>
                                    <input 
                                        required
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={e => setFormData({...formData, price: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Initial Stock</label>
                                    <input 
                                        required
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({...formData, stock: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        placeholder="0"
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
                                    {isSubmitting ? 'Saving...' : 'Save Product'}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

