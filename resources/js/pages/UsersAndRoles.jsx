import React from 'react';

export default function UsersAndRoles() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Users & Roles</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Invite staff, assign roles, and control access to POS and inventory features.
                    </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
                    Invite user
                </button>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    User list, role editor, and permissions matrix will live here.
                </div>
            </div>
        </div>
    );
}

