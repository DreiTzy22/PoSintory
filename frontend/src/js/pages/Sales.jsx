import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Search, Receipt, Calendar, Download, Eye, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sales() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [showDateFilter, setShowDateFilter] = useState(false);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await api.get('/sales');
            setItems(res.data?.data ?? []);
        } catch (e) {
            setError('Unable to load sales. Please login and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        const headers = ['ID', 'Date', 'Customer', 'Payment Method', 'Total Amount'];
        const rows = filteredItems.map(s => [
            s.id,
            new Date(s.created_at).toLocaleDateString(),
            s.customer?.name || 'Guest',
            s.payment_method,
            s.total_amount
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.id.toString().includes(searchQuery) ||
                            item.payment_method.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.customer?.name && item.customer.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const saleDate = new Date(item.created_at).toISOString().split('T')[0];
        const matchesStart = dateRange.start ? saleDate >= dateRange.start : true;
        const matchesEnd = dateRange.end ? saleDate <= dateRange.end : true;

        return matchesSearch && matchesStart && matchesEnd;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Sales</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        View receipts, payments, and transaction history.
                    </p>
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
                            placeholder="Search by ID or payment method"
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <button 
                                onClick={() => setShowDateFilter(!showDateFilter)}
                                className={cn(
                                    "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                                    (dateRange.start || dateRange.end)
                                        ? "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300"
                                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                )}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                {dateRange.start || dateRange.end ? 'Filtered' : 'Date range'}
                            </button>
                            
                            {showDateFilter && (
                                <div className="absolute right-0 mt-2 z-20 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Filter Date</h4>
                                        <button onClick={() => setDateRange({start:'', end:''})} className="text-[10px] text-indigo-600 hover:underline">Clear</button>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-[10px] text-zinc-400 block mb-1">Start Date</label>
                                            <input 
                                                type="date" 
                                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={dateRange.start}
                                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-zinc-400 block mb-1">End Date</label>
                                            <input 
                                                type="date" 
                                                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                                                value={dateRange.end}
                                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setShowDateFilter(false)}
                                        className="w-full bg-indigo-600 text-white text-xs py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                    >
                                        Apply Filter
                                    </button>
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={handleExport}
                            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Receipt ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Payment</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Amount</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr>
                                        <td className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={6}>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                                Loading sales history…
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-12 text-center text-sm text-zinc-500 dark:text-zinc-400" colSpan={6}>
                                            <Receipt className="w-12 h-12 mx-auto opacity-10 mb-3" />
                                            {searchQuery || dateRange.start || dateRange.end ? 'No transactions match your search.' : 'No sales recorded yet.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-4 py-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">#{sale.id}</td>
                                            <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                                                {new Date(sale.created_at).toLocaleDateString()} {new Date(sale.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                                                {sale.customer?.name || 'Guest'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">{sale.payment_method}</td>
                                            <td className="px-4 py-3 text-sm text-right font-semibold text-zinc-900 dark:text-zinc-100">₱{parseFloat(sale.total_amount).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button 
                                                    onClick={() => setSelectedSale(sale)}
                                                    className="p-1.5 rounded-md text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
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

            {/* Sale Details Modal */}
            {selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Sale Details</h3>
                                <p className="text-xs text-zinc-500">Receipt #{selectedSale.id}</p>
                            </div>
                            <button onClick={() => setSelectedSale(null)} className="text-zinc-500 hover:text-zinc-700">
                                <X className="w-5 h-5" />
                            </button>
                        </header>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Date & Time</label>
                                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                                        {new Date(selectedSale.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Customer</label>
                                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                                        {selectedSale.customer?.name || 'Guest'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment Method</label>
                                    <p className="text-sm text-zinc-900 dark:text-zinc-100">{selectedSale.payment_method}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Status</label>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 uppercase">
                                        {selectedSale.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Items Purchased</label>
                                <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {selectedSale.items?.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium truncate">{item.product?.name || 'Unknown Product'}</p>
                                                <p className="text-xs text-zinc-500">{item.quantity} × ₱{parseFloat(item.unit_price).toFixed(2)}</p>
                                            </div>
                                            <p className="text-sm font-bold">₱{parseFloat(item.subtotal).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <footer className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-500">Total Amount</span>
                            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">₱{parseFloat(selectedSale.total_amount).toFixed(2)}</span>
                        </footer>
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

