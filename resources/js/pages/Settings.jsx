import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Save, Store, Globe, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Settings() {
    const [formData, setFormData] = useState({
        store_name: '',
        store_email: '',
        currency: 'PHP',
        timezone: 'Asia/Manila',
        receipt_footer: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/settings');
            if (res.data) {
                setFormData(prev => ({
                    ...prev,
                    ...res.data
                }));
            }
        } catch (e) {
            console.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');
        try {
            await api.post('/settings', formData);
            setSuccessMessage('Settings updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (e) {
            alert('Failed to save settings.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Configure your business profile and system preferences.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                        <Store className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-bold text-zinc-900 dark:text-zinc-100">Business Profile</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Store Name</label>
                                <input 
                                    value={formData.store_name}
                                    onChange={e => setFormData({...formData, store_name: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                    placeholder="e.g. My Awesome Shop"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Business Email</label>
                                <input 
                                    type="email"
                                    value={formData.store_email}
                                    onChange={e => setFormData({...formData, store_email: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100" 
                                    placeholder="contact@shop.com"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" /> Currency
                                </label>
                                <select 
                                    value={formData.currency}
                                    onChange={e => setFormData({...formData, currency: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900"
                                >
                                    <option value="PHP">Philippine Peso (₱)</option>
                                    <option value="USD">US Dollar ($)</option>
                                    <option value="EUR">Euro (€)</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> Timezone
                                </label>
                                <select 
                                    value={formData.timezone}
                                    onChange={e => setFormData({...formData, timezone: e.target.value})}
                                    className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 dark:bg-zinc-900"
                                >
                                    <option value="Asia/Manila">Asia/Manila</option>
                                    <option value="UTC">UTC</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Receipt Footer</label>
                            <textarea 
                                value={formData.receipt_footer}
                                onChange={e => setFormData({...formData, receipt_footer: e.target.value})}
                                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none dark:text-zinc-100 h-24 resize-none" 
                                placeholder="Thank you for shopping with us!"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className={cn(
                        "flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium transition-opacity",
                        successMessage ? "opacity-100" : "opacity-0"
                    )}>
                        <CheckCircle2 className="w-4 h-4" />
                        {successMessage}
                    </div>
                    <button 
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}

