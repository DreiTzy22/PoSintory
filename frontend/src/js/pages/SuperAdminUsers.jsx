import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { User, Search, Edit2, Users, Shield, Plus, Trash2, Building2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast, alertError, confirmAction } from '../lib/swal';

export default function SuperAdminUsers() {
    const [items, setItems] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        role: 'cashier', 
        tenant_id: null 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([loadUsers(), loadTenants()]);
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/admin/users');
            setItems(res.data?.data ?? []);
        } catch (e) {
            console.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const loadTenants = async () => {
        try {
            const res = await api.get('/admin/tenants');
            setTenants(res.data?.data ?? []);
        } catch (e) {
            console.error('Failed to load tenants');
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({ 
            name: '', 
            email: '', 
            password: '', 
            role: 'cashier', 
            tenant_id: null 
        });
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ 
            name: user.name, 
            email: user.email, 
            password: '', 
            role: user.role, 
            tenant_id: user.tenant_id 
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (user) => {
        const result = await confirmAction({
            title: 'Delete User',
            text: `Are you sure you want to delete ${user.name}? This action cannot be undone.`
        });
        if (!result.isConfirmed) return;

        try {
            await api.delete(`/admin/users/${user.id}`);
            toast.fire({ icon: 'success', title: 'User deleted' });
            loadUsers();
        } catch (e) {
            alertError(e, 'Failed to delete user');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingUser) {
                await api.put(`/admin/users/${editingUser.id}`, formData);
                toast.fire({ icon: 'success', title: 'User updated' });
            } else {
                await api.post('/admin/users', formData);
                toast.fire({ icon: 'success', title: 'User created' });
            }
            setIsModalOpen(false);
            loadUsers();
        } catch (e) {
            console.error('Submit error:', e.response?.data || e);
            alertError(e, editingUser ? 'Failed to update user' : 'Failed to create user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoleBadgeClass = (role) => {
        const classes = {
            'super_admin': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            'tenant_admin': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'staff': 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
            'cashier': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        };
        return classes[role] || classes['cashier'];
    };

    const filteredItems = items.filter(i => 
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        i.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">User Management</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Manage all system users across tenants, assign roles, and control access.
                    </p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                </button>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm space-y-4">
                <div className="flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-indigo-500">
                    <Search className="w-4 h-4 text-zinc-400" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                        placeholder="Search users by name or email..."
                    />
                </div>

                <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                            <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Role</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Tenant</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Created</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500">Loading users...</td></tr>
                                ) : filteredItems.length === 0 ? (
                                    <tr><td colSpan={5} className="px-4 py-8 text-center text-zinc-500">No users found.</td></tr>
                                ) : (
                                    filteredItems.map((user) => (
                                        <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user.name}</div>
                                                        <div className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                    getRoleBadgeClass(user.role)
                                                )}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.tenant ? (
                                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                        <Building2 className="w-3 h-3" />
                                                        {user.tenant.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-zinc-400">System Admin</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-zinc-500 dark:text-zinc-400">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 text-right space-x-1">
                                                <button 
                                                    onClick={() => handleEdit(user)}
                                                    className="p-1.5 rounded-md text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(user)}
                                                    className="p-1.5 rounded-md text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                                    title="Delete User"
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-md mx-4">
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {editingUser ? 'Update user details' : 'Create a new system user'}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password {editingUser && '(leave blank to keep current)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="super_admin">Super Admin</option>
                                    <option value="tenant_admin">Tenant Admin</option>
                                    <option value="staff">Staff</option>
                                    <option value="cashier">Cashier</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Assign Tenant</label>
                                <select
                                    value={formData.tenant_id || ''}
                                    onChange={e => setFormData({...formData, tenant_id: e.target.value ? Number(e.target.value) : null})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="">None (System Admin)</option>
                                    {tenants.map(tenant => (
                                        <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="pt-4 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors"
                                >
                                    {isSubmitting ? 'Saving...' : (editingUser ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
