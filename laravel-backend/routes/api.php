<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\{
    AuthController,
    StoreController,
    CustomerController,
    DashboardController,
    FinanceController
};

use App\Http\Controllers\API\AuthController;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

// Test endpoint
Route::get('/test', function() {
    return response()->json([
        'message' => 'API is working',
        'timestamp' => now(),
        'environment' => config('app.env')
    ]);
});

// Fallback for undefined routes
Route::fallback(function () {
    return response()->json([
        'message' => 'API endpoint not found',
        'status' => 'error'
    ], 404);
});

// Test endpoints
Route::get('/test-db', function() {
    try {
        // Test DB connection
        DB::connection()->getPdo();

        // Get users table data
        $users = \App\Models\User::take(1)->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Database connection successful',
            'data' => $users,
            'connection' => DB::connection()->getDatabaseName()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Database connection failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'current']);
    Route::apiResource('stores', StoreController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::prefix('finance')->group(function () {
        Route::get('/transactions', [FinanceController::class, 'index']);
        Route::post('/transactions', [FinanceController::class, 'store']);
        Route::get('/budget', [FinanceController::class, 'budget']);
        Route::put('/budget', [FinanceController::class, 'updateBudget']);
    });
});