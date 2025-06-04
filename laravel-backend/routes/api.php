<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TestController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are grouped based on access level:
| - Public: No auth required
| - Auth: Login/Register/Token Management
| - Protected: Requires sanctum authentication
|
| NOTE: All routes are automatically prefixed with "/api"
*/

// =============================================================================
// PUBLIC ROUTES (No Authentication Required)
// =============================================================================

// System Health & Status
Route::get('health', [TestController::class, 'health'])->name('api.health');
Route::get('system/status', [TestController::class, 'systemStatus'])->name('api.system.status');

// Login Audit Logging
Route::post('audit/log', [TestController::class, 'auditLog'])->name('api.audit.log');

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================

Route::prefix('auth')->name('api.auth.')->group(function () {
    // Public Auth Endpoints
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('sso-init', [AuthController::class, 'initSSO'])->name('sso.init');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');

    // Protected Auth Endpoints
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', [AuthController::class, 'me'])->name('me');
        Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
    });
});

// =============================================================================
// PROTECTED ROUTES (Authentication Required)
// =============================================================================

Route::middleware('auth:sanctum')->group(function () {

    // Authenticated User Info
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
            'timestamp' => now()
        ]);
    })->name('api.user');

    // =============================================================================
    // DASHBOARD ROUTES
    // =============================================================================
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
    });

    // =============================================================================
    // CUSTOMER MANAGEMENT
    // =============================================================================
    Route::apiResource('customers', CustomerController::class, [
        'names' => [
            'index'   => 'api.customers.index',
            'store'   => 'api.customers.store',
            'show'    => 'api.customers.show',
            'update'  => 'api.customers.update',
            'destroy' => 'api.customers.destroy',
        ]
    ]);

    // =============================================================================
    // PRODUCT MANAGEMENT
    // =============================================================================
    Route::apiResource('products', ProductController::class, [
        'names' => [
            'index'   => 'api.products.index',
            'store'   => 'api.products.store',
            'show'    => 'api.products.show',
            'update'  => 'api.products.update',
            'destroy' => 'api.products.destroy',
        ]
    ]);

    // Product Stock Update (Custom Endpoint)
    Route::put('products/{product}/stock', [ProductController::class, 'updateStock'])
        ->name('api.products.update-stock');

    // =============================================================================
    // SYSTEM TEST & MAINTENANCE
    // =============================================================================
    Route::prefix('system')->name('api.system.')->group(function () {
        Route::get('api-status', [TestController::class, 'apiStatus'])->name('api-status');
        Route::get('database-test', [TestController::class, 'databaseTest'])->name('database-test');
    });
});