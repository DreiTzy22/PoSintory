import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';
import { toast, alertError } from '../lib/swal';
import { Search, Plus, Minus, X, CreditCard, Tag, Package, UserPlus, Users, Trash2, Printer, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function POS() {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [cart, setCart] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [lastSale, setLastSale] = useState(null);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });

    const paymentMethods = [
        { id: 'Cash', label: 'Cash', icon: CreditCard },
        { id: 'GCash', label: 'GCash', icon: Tag },
        { id: 'Maya', label: 'Maya', icon: Tag },
        { id: 'Card', label: 'Card', icon: CreditCard },
    ];

    useEffect(() => {
        loadProducts();
        loadCustomers();
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

    const loadCustomers = async (search = '') => {
        try {
            const res = await api.get(`/customers?search=${search}&per_page=50`);
            setCustomers(res.data?.data ?? []);
        } catch (e) {
            console.error('Failed to load customers', e);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;
        const q = searchQuery.toLowerCase();
        return products.filter(p => 
            p.name.toLowerCase().includes(q) || 
            (p.sku && p.sku.toLowerCase().includes(q))
        );
    }, [products, searchQuery]);

    const filteredCustomers = useMemo(() => {
        if (!customerSearchQuery) return customers;
        const q = customerSearchQuery.toLowerCase();
        return customers.filter(c => 
            c.name.toLowerCase().includes(q) || 
            (c.phone && c.phone.includes(q)) ||
            (c.email && c.email.toLowerCase().includes(q))
        );
    }, [customers, customerSearchQuery]);

    const availableStocks = useMemo(() => {
        const stocks = {};
        products.forEach(p => {
            stocks[p.id] = p.stock;
        });
        cart.forEach(item => {
            if (stocks[item.id] !== undefined) {
                stocks[item.id] -= item.quantity;
            }
        });
        return stocks;
    }, [products, cart]);

    const addToCart = (product) => {
        const currentStock = availableStocks[product.id] ?? product.stock;
        if (currentStock <= 0) return;

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
                const product = products.find(p => p.id === productId);
                const currentInCart = item.quantity;
                const totalStock = product?.stock ?? 0;
                
                if (delta > 0 && currentInCart >= totalStock) {
                    return item; // Cannot add more than stock
                }

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
            const res = await api.post('/sales', {
                customer_id: selectedCustomer?.id,
                total_amount: totals.total,
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    subtotal: item.price * item.quantity
                }))
            });
            
            setLastSale(res.data);
            setCart([]);
            setSelectedCustomer(null);
            setPaymentMethod('Cash');
            setIsReceiptModalOpen(true);
            toast.fire({ icon: 'success', title: 'Sale completed!' });
            loadProducts(); // Refresh stock
        } catch (e) {
            alertError('Transaction Failed', 'Unable to process sale. Please check stock and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrintReceipt = () => {
        window.print();
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/customers', newCustomer);
            setCustomers(prev => [res.data, ...prev]);
            setSelectedCustomer(res.data);
            setIsNewCustomerModalOpen(false);
            setIsCustomerModalOpen(false);
            setNewCustomer({ name: '', email: '', phone: '' });
            toast.fire({ icon: 'success', title: 'Customer added!' });
        } catch (e) {
            alertError('Error', 'Failed to add customer. Please check if the email is already taken.');
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
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">₱{Number(item.price).toFixed(2)}</p>
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
                                    <div className="w-20 text-right flex flex-col items-end">
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">₱{(item.price * item.quantity).toFixed(2)}</p>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="mt-1 p-1 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md transition-colors"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
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

                    <div className="space-y-2 pt-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment Method</label>
                        <div className="grid grid-cols-2 gap-2">
                            {paymentMethods.map((pm) => (
                                <button
                                    key={pm.id}
                                    onClick={() => setPaymentMethod(pm.id)}
                                    className={cn(
                                        "flex items-center justify-center gap-2 rounded-md border py-2 text-xs font-medium transition-all",
                                        paymentMethod === pm.id
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-600/10 dark:text-indigo-400"
                                            : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                                    )}
                                >
                                    {pm.label}
                                </button>
                            ))}
                        </div>
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
                        {isSubmitting ? 'Processing...' : `Charge ${paymentMethod}`}
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

                        <button 
                            onClick={() => setIsCustomerModalOpen(true)}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors",
                                selectedCustomer 
                                    ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300"
                                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            )}
                        >
                            {selectedCustomer ? (
                                <>
                                    <Users className="w-4 h-4" />
                                    <span className="max-w-[100px] truncate">{selectedCustomer.name}</span>
                                    <X 
                                        className="w-3 h-3 ml-1 hover:text-indigo-900 dark:hover:text-indigo-100 cursor-pointer" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedCustomer(null);
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" />
                                    Customer
                                </>
                            )}
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
                                        disabled={(availableStocks[p.id] ?? p.stock) <= 0}
                                        className={cn(
                                            "group relative flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 p-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-all active:scale-[0.98]",
                                            (availableStocks[p.id] ?? p.stock) <= 0 && "opacity-50 cursor-not-allowed"
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
                                                    (availableStocks[p.id] ?? p.stock) > 10 ? "bg-emerald-50 text-emerald-600" : (availableStocks[p.id] ?? p.stock) > 0 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
                                                )}>
                                                    {availableStocks[p.id] ?? p.stock} left
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

            {/* Customer Selection Modal */}
            {isCustomerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Select Customer</h3>
                            <button onClick={() => setIsCustomerModalOpen(false)} className="text-zinc-500 hover:text-zinc-700">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Search by name, email or phone..."
                                    value={customerSearchQuery}
                                    onChange={(e) => setCustomerSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2">
                            {filteredCustomers.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500">
                                    <p className="text-sm">No customers found</p>
                                    <button 
                                        onClick={() => setIsNewCustomerModalOpen(true)}
                                        className="mt-4 text-indigo-600 text-sm font-medium hover:underline"
                                    >
                                        + Add new customer
                                    </button>
                                </div>
                            ) : (
                                filteredCustomers.map(customer => (
                                    <button
                                        key={customer.id}
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setIsCustomerModalOpen(false);
                                        }}
                                        className="w-full text-left p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 flex items-center justify-between group transition-colors"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{customer.name}</p>
                                            <p className="text-xs text-zinc-500">{customer.phone || customer.email || 'No contact info'}</p>
                                        </div>
                                        <Plus className="w-4 h-4 text-zinc-300 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all" />
                                    </button>
                                ))
                            )}
                        </div>
                        <footer className="p-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800">
                            <button 
                                onClick={() => setIsNewCustomerModalOpen(true)}
                                className="w-full py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                            >
                                + Create New Customer
                            </button>
                        </footer>
                    </div>
                </div>
            )}

            {/* New Customer Modal */}
            {isNewCustomerModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-sm overflow-hidden">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">New Customer</h3>
                            <button onClick={() => setIsNewCustomerModalOpen(false)} className="text-zinc-500 hover:text-zinc-700">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Full Name</label>
                                <input
                                    required
                                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Phone Number</label>
                                <input
                                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                Create Customer
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {isReceiptModalOpen && lastSale && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:bg-white print:p-0">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col print:shadow-none print:rounded-none print:max-w-none print:h-screen">
                        <header className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between print:hidden">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">Sale Receipt</h3>
                            <button onClick={() => setIsReceiptModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        
                        <div id="receipt-content" className="flex-1 overflow-y-auto p-8 space-y-6 print:overflow-visible">
                            <div className="text-center space-y-1">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-2 print:hidden">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold tracking-tight">PoSintory</h2>
                                <p className="text-xs text-zinc-500">Official Receipt</p>
                            </div>

                            <div className="border-y border-dashed border-zinc-200 dark:border-zinc-800 py-4 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Receipt #</span>
                                    <span className="font-mono font-medium">{lastSale.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Date</span>
                                    <span>{new Date(lastSale.created_at).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Cashier</span>
                                    <span>User #{lastSale.user_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Customer</span>
                                    <span>{lastSale.customer?.name || 'Guest'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-zinc-500">Payment</span>
                                    <span className="font-bold text-indigo-600">{lastSale.payment_method}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Items</div>
                                <div className="space-y-2">
                                    {lastSale.items?.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <div className="flex-1 pr-4">
                                                <p className="font-medium">{item.product?.name || 'Product'}</p>
                                                <p className="text-[10px] text-zinc-500">{item.quantity} × ₱{parseFloat(item.unit_price).toFixed(2)}</p>
                                            </div>
                                            <p className="font-semibold">₱{parseFloat(item.subtotal).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>Subtotal</span>
                                    <span>₱{(lastSale.total_amount / 1.12).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-zinc-500">
                                    <span>VAT (12%)</span>
                                    <span>₱{(lastSale.total_amount - (lastSale.total_amount / 1.12)).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2">
                                    <span>Total</span>
                                    <span className="text-indigo-600">₱{parseFloat(lastSale.total_amount).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="text-center pt-8 print:pt-12">
                                <p className="text-[10px] text-zinc-400 italic">Thank you for your purchase!</p>
                                <p className="text-[10px] text-zinc-400">Please keep this receipt for your records.</p>
                            </div>
                        </div>

                        <footer className="p-6 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 print:hidden">
                            <button 
                                onClick={handlePrintReceipt}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold hover:bg-zinc-800 transition-all"
                            >
                                <Printer className="w-4 h-4" />
                                Print Receipt
                            </button>
                            <button 
                                onClick={() => setIsReceiptModalOpen(false)}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                            >
                                Done
                            </button>
                        </footer>
                    </div>
                </div>
            )}
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

