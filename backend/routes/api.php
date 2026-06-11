<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SaleItemController;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SupplierController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\BranchController;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);
// Route::post('/register', [AuthController::class, 'register']); // Disabled for inquiries only

Route::middleware(['auth:sanctum', 'tenant.status'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    Route::apiResource('products', ProductController::class);
    Route::apiResource('sales', SaleController::class);
    Route::apiResource('sale-items', SaleItemController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('purchase-orders', PurchaseOrderController::class);
    Route::apiResource('tickets', TicketController::class);
    Route::apiResource('branches', BranchController::class);
    
    // Super Admin Only Routes
    Route::middleware('role:super_admin')->prefix('admin')->group(function () {
        Route::get('/tenants', [SuperAdminController::class, 'tenants']);
        Route::post('/tenants', [SuperAdminController::class, 'storeTenant']);
        Route::get('/tenants/{tenant}', [SuperAdminController::class, 'tenantDetails']);
        Route::put('/tenants/{tenant}', [SuperAdminController::class, 'updateTenant']);
        Route::get('/system-health', [SuperAdminController::class, 'systemHealth']);
        Route::get('/analytics', [SuperAdminController::class, 'analytics']);
        Route::get('/users', [SuperAdminController::class, 'users']);
        Route::post('/users', [SuperAdminController::class, 'storeUser']);
        Route::put('/users/{user}', [SuperAdminController::class, 'updateUser']);
        Route::delete('/users/{user}', [SuperAdminController::class, 'deleteUser']);
    });

    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'store']);

    Route::get('/stats', function (Request $request) {
        $user = $request->user();
        
        if ($user->isSuperAdmin()) {
            return [
                'total_tenants' => \App\Models\Tenant::count(),
                'total_users' => \App\Models\User::count(),
                'open_tickets' => \App\Models\Ticket::withoutGlobalScopes()->where('status', 'open')->count(),
                'total_sales' => (float) \App\Models\Sale::withoutGlobalScopes()->sum('total_amount'),
            ];
        }

        $branchId = $request->query('branch_id');
        $today = now()->startOfDay();
        $sevenDaysAgo = now()->subDays(6)->startOfDay();

        // Helper function to apply branch filter
        $applyBranchFilter = function ($query) use ($branchId) {
            if ($branchId) {
                $query->where('branch_id', $branchId);
            }
            return $query;
        };

        // Generate last 7 days
        $salesTrend = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->startOfDay();
            $salesTrend->push([
                'date' => $date->format('Y-m-d'),
                'day' => $date->format('D'),
                'sales' => 0.0,
            ]);
        }

        // Get real sales data for last 7 days, filtered by branch if needed
        $dbSalesQuery = \App\Models\Sale::selectRaw('DATE(created_at) as date, SUM(total_amount) as sales')
            ->where('created_at', '>=', $sevenDaysAgo);
        $dbSales = $applyBranchFilter($dbSalesQuery)
            ->groupByRaw('DATE(created_at)')
            ->orderByRaw('DATE(created_at)')
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'sales' => floatval($item->sales),
            ]);

        // Merge real data into our day list
        foreach ($dbSales as $dbSale) {
            $existingDay = $salesTrend->firstWhere('date', $dbSale['date']);
            if ($existingDay) {
                $existingDay['sales'] = $dbSale['sales'];
            }
        }

        // Extract just sales values for frontend graph
        $salesTrendValues = $salesTrend->pluck('sales')->toArray();

        // Get all branches for the tenant
        $branches = \App\Models\Branch::all();

        return [
            'today_sales' => (float) $applyBranchFilter(\App\Models\Sale::where('created_at', '>=', $today))->sum('total_amount'),
            'low_stock_count' => $applyBranchFilter(\App\Models\Product::whereRaw('stock <= 6'))->count(),
            'total_products' => $applyBranchFilter(\App\Models\Product::query())->count(),
            'inventory_value' => (float) $applyBranchFilter(\App\Models\Product::selectRaw('SUM(stock * price) as total'))->value('total'),
            'top_product' => $applyBranchFilter(\App\Models\Product::withCount(['saleItems as total_qty' => function ($query) use ($branchId) {
                    $query->select(DB::raw('sum(quantity)'));
                    if ($branchId) {
                        $query->whereHas('sale', fn($q) => $q->where('branch_id', $branchId));
                    }
                }]))
                ->orderBy('total_qty', 'desc')
                ->first()?->name ?? 'None',
            'sales_trend' => $salesTrendValues,
            'sales_trend_labels' => $salesTrend->pluck('day')->toArray(),
            'branches' => $branches,
            'selected_branch_id' => $branchId ? (int)$branchId : null,
        ];
    });
});
