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

        $today = now()->startOfDay();

        return [
            'today_sales' => (float) \App\Models\Sale::where('created_at', '>=', $today)->sum('total_amount'),
            'low_stock_count' => \App\Models\Product::whereRaw('stock <= 6')->count(),
            'total_products' => \App\Models\Product::count(),
            'inventory_value' => (float) \App\Models\Product::selectRaw('SUM(stock * price) as total')->value('total'),
            'top_product' => \App\Models\Product::withCount(['saleItems as total_qty' => function ($query) {
                    $query->select(DB::raw('sum(quantity)'));
                }])
                ->orderBy('total_qty', 'desc')
                ->first()?->name ?? 'None'
        ];
    });
});
