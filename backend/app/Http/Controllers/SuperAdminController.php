<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SuperAdminController extends Controller
{
    public function tenants()
    {
        return Tenant::withCount('users')->latest()->paginate(25);
    }

    public function tenantDetails(Tenant $tenant)
    {
        return $tenant->load('users');
    }

    public function updateTenant(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'plan' => 'required|string|in:free,pro,enterprise',
            'status' => 'required|string|in:active,disabled',
        ]);

        $tenant->update($validated);
        return $tenant;
    }

    public function storeTenant(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'plan' => 'required|string|in:free,pro,enterprise',
            'status' => 'nullable|string|in:active,disabled',
            'user_name' => 'required|string|max:255',
            'user_email' => 'required|email|max:255|unique:users,email',
            'user_password' => 'required|string|min:8',
        ]);

        return DB::transaction(function () use ($validated) {
            $tenant = Tenant::create([
                'name' => $validated['name'],
                'plan' => $validated['plan'],
                'status' => $validated['status'] ?? 'active',
            ]);

            User::create([
                'name' => $validated['user_name'],
                'email' => $validated['user_email'],
                'password' => Hash::make($validated['user_password']),
                'role' => 'tenant_admin',
                'tenant_id' => $tenant->id,
            ]);

            return response()->json($tenant->load('users'), 201);
        });
    }

    public function systemHealth()
    {
        return [
            'database' => DB::connection()->getDatabaseName(),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'total_tenants' => Tenant::count(),
            'total_users' => User::count(),
            'total_sales' => \App\Models\Sale::withoutGlobalScopes()->sum('total_amount'),
        ];
    }
}
