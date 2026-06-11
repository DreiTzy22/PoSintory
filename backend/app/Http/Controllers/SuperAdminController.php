<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Sale;
use App\Models\Product;
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
            'total_sales' => Sale::withoutGlobalScopes()->sum('total_amount'),
        ];
    }

    public function analytics()
    {
        // Monthly sales trend (using Eloquent Model, not Query Builder!)
        $salesTrend = Sale::withoutGlobalScopes()
            ->selectRaw('DATE_FORMAT(created_at, "%b") as name, SUM(total_amount) as sales')
            ->groupByRaw('DATE_FORMAT(created_at, "%Y-%m"), DATE_FORMAT(created_at, "%b")')
            ->orderByRaw('DATE_FORMAT(created_at, "%Y-%m")')
            ->limit(6)
            ->get()
            ->map(fn ($item) => [
                'name' => $item->name,
                'sales' => floatval($item->sales),
            ]);

        // Top tenants by revenue
        $topTenants = Tenant::withCount('users')
            ->with(['sales' => function ($query) {
                $query->withoutGlobalScopes();
            }])
            ->get()
            ->map(function ($tenant) {
                $totalRevenue = $tenant->sales->sum('total_amount');
                return [
                    'name' => $tenant->name,
                    'revenue' => floatval($totalRevenue),
                    'users' => $tenant->users_count,
                ];
            })
            ->sortByDesc('revenue')
            ->values()
            ->take(5);

        // Products per tenant instead of categories!
        $productDistribution = Product::withoutGlobalScopes()
            ->selectRaw('tenant_id, COUNT(*) as value')
            ->groupBy('tenant_id')
            ->with('tenant')
            ->get()
            ->map(fn ($item) => [
                'name' => $item->tenant?->name ?? 'Unassigned',
                'value' => $item->value,
            ]);

        // Recent activity
        $recentActivity = [
            ['type' => 'Tenant', 'message' => 'New tenant registered', 'time' => '2 hours ago'],
            ['type' => 'Support', 'message' => 'Support ticket created', 'time' => '4 hours ago'],
            ['type' => 'System', 'message' => 'Daily backup completed', 'time' => 'Yesterday'],
        ];

        return [
            'sales_trend' => $salesTrend->isEmpty() ? [
                ['name' => 'Jan', 'sales' => 0],
                ['name' => 'Feb', 'sales' => 0],
                ['name' => 'Mar', 'sales' => 0],
            ] : $salesTrend,
            'top_tenants' => $topTenants->isEmpty() ? [
                ['name' => 'Sample Store', 'revenue' => 4000, 'users' => 12],
            ] : $topTenants,
            'category_distribution' => $productDistribution->isEmpty() ? [
                ['name' => 'Electronics', 'value' => 400],
                ['name' => 'Food', 'value' => 300],
            ] : $productDistribution,
            'recent_activity' => $recentActivity,
        ];
    }

    public function users()
    {
        return User::with('tenant')->withoutGlobalScopes()->latest()->paginate(25);
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:super_admin,tenant_admin,staff,cashier',
            'password' => 'nullable|string|min:8',
        ]);

        if ($validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        return $user->load('tenant');
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:super_admin,tenant_admin,staff,cashier',
            'tenant_id' => 'nullable|exists:tenants,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json($user->load('tenant'), 201);
    }

    public function deleteUser(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
