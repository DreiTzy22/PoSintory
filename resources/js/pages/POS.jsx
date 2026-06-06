import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';
import { Search, Plus, Minus, X, CreditCard, Tag, Package, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';

export default function POS() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async (search = '') => {
        setIsLoading(true);
        try {
            const res = await api.get(`/products?search=${search}&per_page=100`);
            setProducts(res.data?.data ?? []);
        } catch (e) {
            console.error('Failed to load products', e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        // Simple client-side search for speed, but could also debounced loadProducts(query)
    };

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        const q = searchQuery.toLowerCase();
        return products.filter(p => 
            p.name.toLowerCase().includes(q) || 
            (p.sku && p.sku.toLowerCase().includes(q)) ||
            (p.barcode && p.barcode.toLowerCase().includes(q))
        );
    }, [products, searchQuery]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const totals = useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.12; // Example 12% tax
        const total = subtotal + tax;
        return { subtotal, tax, total };
    }, [cart]);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        try {
            await api.post('/sales', {
                total_amount: totals.total,
                payment_method: 'Cash',
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    total_price: item.price * item.quantity
                }))
            });
            setCart([]);
            alert('Sale completed successfully!');
            loadProducts(); // Refresh stock
        } catch (e) {
            alert('Failed to process sale. Please check stock and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem)] -m-4 sm:-m-6">
            {/* Left: Cart */}
            <section className="w-full lg:w-2/5 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                <header className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/50">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Current sale</h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{cart.length} items in cart</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                        Register 1
                    </span>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 space-y-2">
                            <ShoppingCart className="w-12 h-12 opacity-20" />
                            <p className="text-sm">Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 px-3 py-2">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{item.name}</p>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">₱{item.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-900">
                                        <button 
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="p-1 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="w-20 text-right">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">₱{(item.price * item.quantity).toFixed(2)}</p>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[10px] font-medium text-rose-600 dark:text-rose-400 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <footer className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-800/50 space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">₱{totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-500 dark:text-zinc-400">Tax (12%)</span>
                            <span className="font-medium text-zinc-900 dark:text-zinc-100">₱{totals.tax.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-base font-semibold border-t border-zinc-200 dark:border-zinc-700 pt-3">
                        <span className="text-zinc-900 dark:text-zinc-100">Total</span>
                        <span className="text-2xl tracking-tight text-indigo-600 dark:text-indigo-400">₱{totals.total.toFixed(2)}</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            <Tag className="w-3.5 h-3.5" />
                            Discount
                        </button>
                        <button 
                            onClick={() => setCart([])}
                            className="inline-flex items-center justify-center rounded-md border border-rose-200 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-500/20"
                        >
                            Clear
                        </button>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <CreditCard className="w-4 h-4" />
                        {isSubmitting ? 'Processing...' : 'Charge customer'}
                    </button>
                </footer>
            </section>

            {/* Right: Product search & catalog */}
            <section className="w-full lg:flex-1 flex flex-col min-h-0">
                <header className="mb-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Select products to add to current sale.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row gap-3">
                        <div className="flex-1 flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm focus-within:ring-1 focus-within:ring-indigo-500">
                            <Search className="w-4 h-4 text-zinc-400" />
                            <input
                                value={searchQuery}
                                onChange={handleSearch}
                                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                placeholder="Search products..."
                            />
                        </div>

                        <button className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            <UserPlus className="w-4 h-4" />
                            Customer
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-hidden flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="flex items-center gap-2 p-4 border-b border-zinc-200 dark:border-zinc-800 text-xs">
                        <button className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 font-medium text-indigo-700 dark:text-indigo-300">
                            All Items
                        </button>
                        <button className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Recently Added
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {isLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                    <div key={i} className="h-40 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-12">
                                <Package className="w-12 h-12 opacity-20 mb-2" />
                                <p>No products found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredProducts.map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => addToCart(p)}
                                        disabled={p.stock <= 0}
                                        className={cn(
                                            "group relative flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 p-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all active:scale-[0.98]",
                                            p.stock <= 0 && "opacity-50 cursor-not-allowed"
                                        )}
                                    >
                                        <div className="aspect-square rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-3 flex items-center justify-center text-zinc-300">
                                            <Package className="w-8 h-8 opacity-20" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{p.name}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">₱{parseFloat(p.price).toFixed(2)}</p>
                                                <p className={cn(
                                                    "text-[10px] font-medium px-1.5 py-0.5 rounded",
                                                    p.stock > 10 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                )}>
                                                    {p.stock} left
                                                </p>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 rounded-xl bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

// Helper icons
function ShoppingCart(props) {
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
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    )
}

