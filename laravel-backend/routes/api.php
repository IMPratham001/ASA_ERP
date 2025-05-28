<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// =============================================================================
// PUBLIC ROUTES (No Authentication Required)
// =============================================================================

// Health check endpoint - CRITICAL for frontend monitoring
Route::get('health', [TestController::class, 'health'])
    ->name('api.health');

// System status for login page - CRITICAL for frontend
Route::get('system/status', [TestController::class, 'systemStatus'])
    ->name('api.system.status');

// Audit logging endpoint for login attempts
Route::post('audit/log', [TestController::class, 'auditLog'])
    ->name('api.audit.log');

// =============================================================================
// AUTHENTICATION ROUTES
// =============================================================================

Route::prefix('auth')->name('api.auth.')->group(function () {
    // Public auth endpoints
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('sso-init', [AuthController::class, 'initSSO'])->name('sso.init');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');

    // Protected auth routes
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

    // User info endpoint
    Route::get('/user', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
            'timestamp' => now()
        ]);
    })->name('api.user');

    // =============================================================================
    // CUSTOMER MANAGEMENT
    // =============================================================================
    Route::apiResource('customers', CustomerController::class, [
        'names' => [
            'index' => 'api.customers.index',
            'store' => 'api.customers.store',
            'show' => 'api.customers.show',
            'update' => 'api.customers.update',
            'destroy' => 'api.customers.destroy'
        ]
    ]);

    // =============================================================================
    // PRODUCT MANAGEMENT
    // =============================================================================
    Route::apiResource('products', ProductController::class, [
        'names' => [
            'index' => 'api.products.index',
            'store' => 'api.products.store',
            'show' => 'api.products.show',
            'update' => 'api.products.update',
            'destroy' => 'api.products.destroy'
        ]
    ]);

    // Additional product endpoints
    Route::put('products/{product}/stock', [ProductController::class, 'updateStock'])
        ->name('api.products.update-stock');

    // =============================================================================
    // SYSTEM MANAGEMENT
    // =============================================================================
    Route::prefix('system')->name('api.system.')->group(function () {
        Route::get('api-status', [TestController::class, 'apiStatus'])->name('api-status');
        Route::get('database-test', [TestController::class, 'databaseTest'])->name('database-test');
    });
});
