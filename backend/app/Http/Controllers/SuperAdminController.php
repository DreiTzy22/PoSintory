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
        return Tenant::withCount(['users', 'products', 'customers', 'suppliers', 'purchaseOrders', 'sales'])
            ->with(['sales' => function ($query) {
                $query->withoutGlobalScopes();
            }])
            ->latest()
            ->get()
            ->map(function ($tenant) {
                $totalRevenue = $tenant->sales->sum('total_amount');
                return [
                    ...$tenant->toArray(),
                    'total_revenue' => floatval($totalRevenue),
                ];
            });
    }

    public function tenantDetails(Tenant $tenant)
    {
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();

        $totalRevenue = $tenant->sales()->withoutGlobalScopes()->sum('total_amount');
        $todaySales = $tenant->sales()->withoutGlobalScopes()->where('created_at', '>=', $today)->sum('total_amount');
        $thisMonthSales = $tenant->sales()->withoutGlobalScopes()->where('created_at', '>=', $thisMonth)->sum('total_amount');
        $totalProducts = $tenant->products()->count();
        $lowStockProducts = $tenant->products()->where('stock', '<=', 6)->count();
        $totalCustomers = $tenant->customers()->count();

        $recentSales = $tenant->sales()->withoutGlobalScopes()
            ->with(['items.product', 'customer'])
            ->latest()
            ->take(5)
            ->get();

        // Tenant-specific sales trend (last 6 months)
        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();
        $tenantSalesTrend = collect();
        for ($date = $sixMonthsAgo; $date->lte(now()->startOfMonth()); $date->addMonth()) {
            $tenantSalesTrend->push([
                'name' => $date->format('M'),
                'sales' => 0.0,
                'year_month' => $date->format('Y-m'),
            ]);
        }

        $dbTenantSales = $tenant->sales()->withoutGlobalScopes()
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as year_month, DATE_FORMAT(created_at, "%b") as name, SUM(total_amount) as sales')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupByRaw('DATE_FORMAT(created_at, "%Y-%m"), DATE_FORMAT(created_at, "%b")')
            ->orderByRaw('DATE_FORMAT(created_at, "%Y-%m")')
            ->get()
            ->map(fn ($item) => [
                'year_month' => $item->year_month,
                'name' => $item->name,
                'sales' => floatval($item->sales),
            ]);

        foreach ($dbTenantSales as $dbSale) {
            $existingMonth = $tenantSalesTrend->firstWhere('year_month', $dbSale['year_month']);
            if ($existingMonth) {
                $existingMonth['sales'] = $dbSale['sales'];
            }
        }

        $tenantSalesTrend = $tenantSalesTrend->map(fn ($month) => [
            'name' => $month['name'],
            'sales' => $month['sales'],
        ]);

        return [
            'tenant' => $tenant->load('users'),
            'statistics' => [
                'total_revenue' => floatval($totalRevenue),
                'today_sales' => floatval($todaySales),
                'this_month_sales' => floatval($thisMonthSales),
                'total_products' => $totalProducts,
                'low_stock_products' => $lowStockProducts,
                'total_customers' => $totalCustomers,
                'total_suppliers' => $tenant->suppliers()->count(),
                'total_purchase_orders' => $tenant->purchaseOrders()->count(),
                'total_sales' => $tenant->sales()->withoutGlobalScopes()->count(),
            ],
            'sales_trend' => $tenantSalesTrend,
            'recent_sales' => $recentSales,
        ];
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
        // Get the last 6 months
        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();
        $currentMonth = now()->startOfMonth();

        $salesTrend = collect();

        // Generate all months in range
        for ($date = $sixMonthsAgo; $date->lte($currentMonth); $date->addMonth()) {
            $salesTrend->push([
                'name' => $date->format('M'),
                'sales' => 0.0,
                'year_month' => $date->format('Y-m'),
            ]);
        }

        // Get real sales data
        $dbSales = Sale::withoutGlobalScopes()
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as year_month, DATE_FORMAT(created_at, "%b") as name, SUM(total_amount) as sales')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->groupByRaw('DATE_FORMAT(created_at, "%Y-%m"), DATE_FORMAT(created_at, "%b")')
            ->orderByRaw('DATE_FORMAT(created_at, "%Y-%m")')
            ->get()
            ->map(fn ($item) => [
                'year_month' => $item->year_month,
                'name' => $item->name,
                'sales' => floatval($item->sales),
            ]);

        // Merge real data into our month list
        foreach ($dbSales as $dbSale) {
            $existingMonth = $salesTrend->firstWhere('year_month', $dbSale['year_month']);
            if ($existingMonth) {
                $existingMonth['sales'] = $dbSale['sales'];
            }
        }

        // Remove year_month from final output
        $salesTrend = $salesTrend->map(fn ($month) => [
            'name' => $month['name'],
            'sales' => $month['sales'],
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

        // Real recent activity
        $recentActivity = collect();

        // Add recent tenants
        $recentTenants = Tenant::latest()->take(2)->get()->map(function ($tenant) {
            return [
                'type' => 'Tenant',
                'message' => "New tenant registered: {$tenant->name}",
                'time' => $tenant->created_at->diffForHumans(),
            ];
        });
        $recentActivity = $recentActivity->merge($recentTenants);

        // Add recent sales
        $recentSales = Sale::withoutGlobalScopes()->with('tenant')->latest()->take(3)->get()->map(function ($sale) {
            $tenantName = $sale->tenant ? $sale->tenant->name : 'Unknown';
            return [
                'type' => 'Sale',
                'message' => "New sale recorded for {$tenantName}: ₱" . number_format($sale->total_amount, 2),
                'time' => $sale->created_at->diffForHumans(),
            ];
        });
        $recentActivity = $recentActivity->merge($recentSales);

        // Add recent users
        $recentUsers = User::withoutGlobalScopes()->with('tenant')->latest()->take(2)->get()->map(function ($user) {
            $tenantName = $user->tenant ? $user->tenant->name : 'No tenant';
            return [
                'type' => 'User',
                'message' => "New user registered: {$user->name} ({$tenantName})",
                'time' => $user->created_at->diffForHumans(),
            ];
        });
        $recentActivity = $recentActivity->merge($recentUsers);

        // Add recent tickets
        $recentTickets = \App\Models\Ticket::withoutGlobalScopes()->with(['tenant', 'user'])->latest()->take(2)->get()->map(function ($ticket) {
            $tenantName = $ticket->tenant ? $ticket->tenant->name : 'Unknown';
            return [
                'type' => 'Support',
                'message' => "Support ticket created: {$ticket->subject} ({$tenantName})",
                'time' => $ticket->created_at->diffForHumans(),
            ];
        });
        $recentActivity = $recentActivity->merge($recentTickets);

        // Sort by time and take top 7
        $recentActivity = $recentActivity->sortByDesc('time')->take(7)->values()->toArray();

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
        return User::with(['tenant', 'branch'])->withoutGlobalScopes()->latest()->get();
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:super_admin,tenant_admin,branch_manager,staff,cashier',
            'password' => 'nullable|string|min:8',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        if ($validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        return $user->load(['tenant', 'branch']);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:super_admin,tenant_admin,branch_manager,staff,cashier',
            'tenant_id' => 'nullable|exists:tenants,id',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        return response()->json($user->load(['tenant', 'branch']), 201);
    }

    public function deleteUser(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }
}
