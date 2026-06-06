import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Building2, Search, Edit2, Users, Shield, ExternalLink, AlertCircle, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SuperAdminTenants() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTenant, setEditingTenant] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        plan: 'free',
        status: 'active',
        user_name: '',
        user_email: '',
        user_password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadTenants();
    }, []);

    const loadTenants = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/tenants');
            setItems(res.data?.data ?? []);
        } catch (e) {
            console.error('Failed to load tenants');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingTenant(null);
        setFormData({ 
            name: '', 
            plan: 'free',
            status: 'active',
            user_name: '',
            user_email: '',
            user_password: ''
        });
        setIsModalOpen(true);
    };

    const handleEdit = (tenant) => {
        setEditingTenant(tenant);
        setFormData({ 
            name: tenant.name, 
            plan: tenant.plan,
            status: tenant.status || 'active',
            user_name: '', // Not used for edit
            user_email: '',
            user_password: ''
        });
        setIsModalOpen(true);
    };

    const toggleStatus = async (tenant) => {
        const newStatus = tenant.status === 'active' ? 'disabled' : 'active';
        if (!confirm(`Are you sure you want to ${newStatus === 'active' ? 'enable' : 'disable'} this business?`)) return;
        
        try {
            await api.put(`/admin/tenants/${tenant.id}`, {
                name: tenant.name,
                plan: tenant.plan,
                status: newStatus
            });
            loadTenants();
        } catch (e) {
            alert('Failed to update tenant status');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingTenant) {
                await api.put(`/admin/tenants/${editingTenant.id}`, formData);
            } else {
                await api.post('/admin/tenants', formData);
            }
            setIsModalOpen(false);
            loadTenants();
        } catch (e) {
            console.error('Submit error:', e.response?.data || e);
            
            if (e.response?.status === 422) {
                const errors = e.response.data.errors;
                const firstError = Object.values(errors)[0][0];
                alert(`Validation Error: ${firstError}`);
            } else {
                const errorMsg = e.response?.data?.message || e.message || 'Unknown error';
                alert(`${editingTenant ? 'Failed to update tenant' : 'Failed to create tenant'}: ${errorMsg}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredItems = items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Tenant Management</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Oversee all business accounts, subscription plans, and workspace information.
                    </p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Tenant</span>
                </button>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-indigo-500">
                    <Search className="w-4 h-4 text-zinc-400" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                        placeholder="Search by business name..."
                    />
                </div>

                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Business Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Plan</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Users</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Created</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500">Loading tenants...</td></tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500">No tenants found.</td></tr>
                                ) : (
                                    filteredItems.map((tenant) => (
                                        <tr key={tenant.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                        <Building2 className="w-4 h-4" />
                                                    </div>
                                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{tenant.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                    tenant.plan === 'enterprise' ? "bg-purple-100 text-purple-700" :
                                                    tenant.plan === 'pro' ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-700"
                                                )}>
                                                    {tenant.plan}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                    tenant.status === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                                )}>
                                                    {tenant.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right text-zinc-500 dark:text-zinc-400">{tenant.users_count}</td>
                                            <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{new Date(tenant.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-right space-x-1">
                                                <button 
                                                    onClick={() => toggleStatus(tenant)}
                                                    className={cn(
                                                        "p-1.5 rounded-md transition-colors",
                                                        tenant.status === 'active' ? "text-rose-500 hover:bg-rose-50" : "text-emerald-500 hover:bg-emerald-50"
                                                    )}
                                                    title={tenant.status === 'active' ? 'Disable Business' : 'Enable Business'}
                                                >
                                                    <Shield className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleEdit(tenant)}
                                                    className="p-1.5 rounded-md text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
                            </h2>
                        </header>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b pb-2">Business Information</h3>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Business Name</label>
                                    <input 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Subscription Plan</label>
                                    <select 
                                        value={formData.plan}
                                        onChange={e => setFormData({...formData, plan: e.target.value})}
                                        className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900"
                                    >
                                        <option value="free">Free</option>
                                        <option value="pro">Professional</option>
                                        <option value="enterprise">Enterprise</option>
                                    </select>
                                </div>
                            </div>

                            {!editingTenant && (
                                <div className="space-y-4 pt-4">
                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b pb-2">Admin Account Details</h3>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Full Name</label>
                                        <input 
                                            required
                                            value={formData.user_name}
                                            onChange={e => setFormData({...formData, user_name: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Email Address</label>
                                        <input 
                                            required
                                            type="email"
                                            value={formData.user_email}
                                            onChange={e => setFormData({...formData, user_email: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Password</label>
                                        <input 
                                            required
                                            type="password"
                                            value={formData.user_password}
                                            onChange={e => setFormData({...formData, user_password: e.target.value})}
                                            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                        />
                                    </div>
                                </div>
                            )}

                            <footer className="pt-6 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-zinc-900 border-t mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-100 rounded-lg">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50">
                                    {isSubmitting ? 'Saving...' : (editingTenant ? 'Save Changes' : 'Create Tenant')}
                                </button>
                            </footer>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
