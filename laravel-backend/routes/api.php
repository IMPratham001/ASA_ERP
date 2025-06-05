<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\Api\SystemController;
use App\Http\Controllers\Api\HealthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are automatically prefixed with "/api"
| Sanctum-protected and public routes are separated below.
*/

// ============================================================================
// PUBLIC ROUTES (No Authentication Required)
// ============================================================================

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API connection successful',
        'timestamp' => now(),
        'server' => 'Laravel ' . app()->version()
    ]);
}); // TODO: Remove in production

Route::get('health', [TestController::class, 'health'])->name('api.health');
Route::get('system/status', [TestController::class, 'systemStatus'])->name('api.system.status');

// Audit routes (unauthenticated)
Route::post('audit/log', [AuditLogController::class, 'store'])->name('api.audit.log');
Route::post('audit-log', [AuditLogController::class, 'store']); // Alias

// ============================================================================
// AUTH ROUTES
// ============================================================================

Route::prefix('auth')->name('api.auth.')->group(function () {
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('sso-init', [AuthController::class, 'initSSO'])->name('sso.init');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', [AuthController::class, 'me'])->name('me');
        Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
    });
});

// ============================================================================
// PROTECTED ROUTES (Require Authentication)
// ============================================================================

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
            'timestamp' => now(),
        ]);
    })->name('api.user');

    // Dashboard Routes
    Route::prefix('dashboard')->name('api.dashboard.')->group(function () {
        Route::get('stats', [DashboardController::class, 'stats'])->name('stats');
        Route::get('overview', [DashboardController::class, 'overview'])->name('overview');
        Route::get('sales-performance', [DashboardController::class, 'salesPerformance'])->name('sales-performance');
        Route::get('category-distribution', [DashboardController::class, 'categoryDistribution'])->name('category-distribution');
        Route::get('hourly-traffic', [DashboardController::class, 'hourlyTraffic'])->name('hourly-traffic');
        Route::get('performance-metrics', [DashboardController::class, 'performanceMetrics'])->name('performance-metrics');
        Route::get('top-products', [DashboardController::class, 'topProducts'])->name('top-products');
        Route::get('recent-sales', [DashboardController::class, 'recentSales'])->name('recent-sales');
        Route::get('system-status', [DashboardController::class, 'systemStatus'])->name('system-status');
        Route::get('inventory-alerts', [DashboardController::class, 'inventoryAlerts'])->name('inventory-alerts');
        Route::get('revenue-by-month', [DashboardController::class, 'revenueByMonth'])->name('revenue-by-month');
        Route::get('customer-growth', [DashboardController::class, 'customerGrowth'])->name('customer-growth');
        Route::get('orders-by-status', [DashboardController::class, 'ordersByStatus'])->name('orders-by-status');
        Route::get('geographic-data', [DashboardController::class, 'geographicData'])->name('geographic-data');
    });

    // Customer Management
    Route::apiResource('customers', CustomerController::class)->names([
        'index' => 'api.customers.index',
        'store' => 'api.customers.store',
        'show' => 'api.customers.show',
        'update' => 'api.customers.update',
        'destroy' => 'api.customers.destroy',
    ]);

    // Product Management
    Route::apiResource('products', ProductController::class)->names([
        'index' => 'api.products.index',
        'store' => 'api.products.store',
        'show' => 'api.products.show',
        'update' => 'api.products.update',
        'destroy' => 'api.products.destroy',
    ]);
    Route::put('products/{product}/stock', [ProductController::class, 'updateStock'])->name('api.products.update-stock');

    // System Maintenance
    Route::prefix('system')->name('api.system.')->group(function () {
        Route::get('api-status', [TestController::class, 'apiStatus'])->name('api-status');
        Route::get('database-test', [TestController::class, 'databaseTest'])->name('database-test');
    });
});
