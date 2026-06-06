import React from 'react';

export default function POS() {
    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-5rem)] -m-4 sm:-m-6">
            {/* Left: Cart */}
            <section className="w-full lg:w-2/5 flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
                <header className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Current sale</h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Scan or search products to add them to the cart.</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                        Register 1 · Main Store
                    </span>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 px-3 py-2">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">Sample item (demo)</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">SKU: DEMO-001</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                −
                            </button>
                            <input
                                className="h-8 w-12 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-center text-sm text-zinc-900 dark:text-zinc-100"
                                defaultValue="1"
                                inputMode="numeric"
                            />
                            <button className="h-8 w-8 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                                +
                            </button>
                            <div className="w-20 text-right">
                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">₱99.00</p>
                                <button className="text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:underline">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>Tip</span>
                        <span>Use barcode scanner, Enter adds the item.</span>
                    </div>
                </div>

                <footer className="border-t border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">₱99.00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">Tax</span>
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">₱0.00</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-semibold">
                        <span className="text-zinc-900 dark:text-zinc-100">Total</span>
                        <span className="text-2xl tracking-tight text-emerald-600 dark:text-emerald-400">₱99.00</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button className="flex-1 inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Discount
                        </button>
                        <button className="inline-flex items-center justify-center rounded-md border border-amber-200 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100/80 dark:hover:bg-amber-500/20">
                            Hold sale
                        </button>
                        <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Clear
                        </button>
                    </div>

                    <button className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950/0">
                        Charge customer
                    </button>
                </footer>
            </section>

            {/* Right: Product search & catalog */}
            <section className="w-full lg:flex-1 flex flex-col">
                <header className="mb-3">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Point of Sale</h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Fast checkout with search, barcode scanning, and customer selection.
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col md:flex-row gap-3">
                        <div className="flex-1 flex rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm">
                            <input
                                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                placeholder="Scan barcode or search by name / SKU"
                            />
                            <span className="ml-3 inline-flex items-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                                Focus
                                <span className="ml-1 rounded border border-zinc-300 dark:border-zinc-600 px-1 text-[10px]">
                                    Ctrl + /
                                </span>
                            </span>
                        </div>

                        <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Add customer
                        </button>
                    </div>
                </header>

                <div className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <div className="flex items-center gap-2 text-xs mb-4">
                        <button className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 font-medium text-indigo-700 dark:text-indigo-300">
                            Search
                        </button>
                        <button className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Categories
                        </button>
                        <button className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800">
                            Favorites
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                        {[
                            { name: 'Iced Coffee', price: '₱99.00' },
                            { name: 'Bottled Water', price: '₱25.00' },
                            { name: 'Chocolate Bar', price: '₱45.00' },
                            { name: 'Sandwich', price: '₱120.00' },
                            { name: 'Milk Tea', price: '₱110.00' },
                            { name: 'Chips', price: '₱35.00' },
                            { name: 'Soda', price: '₱30.00' },
                            { name: 'Bread', price: '₱55.00' },
                        ].map((p) => (
                            <button
                                key={p.name}
                                className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 p-3 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                            >
                                <div className="aspect-4/3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-3" />
                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{p.name}</p>
                                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{p.price}</p>
                                <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to add
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

